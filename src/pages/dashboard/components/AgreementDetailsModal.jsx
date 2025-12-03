import { useState, useEffect, useMemo, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAgreementsByUnit } from "@/slices/agreement-slice";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loader2, FileText, Pencil, ChevronDown, ChevronUp, Download } from "lucide-react";
import UserContext from "@/context/UserContext";

// Import our new clean components
import AgreementView from "./AgreementDetailsModal/AgreementView";
import AgreementEditForm from "./AgreementDetailsModal/AgreementEditForm";
import LeaseAgreementDocument from "@/components/documents/LeaseAgreementDocument";

export default function AgreementDetailsModal({ children, unitId }) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAgreementId, setEditingAgreementId] = useState(null);
  const [expandedId, setExpandedId] = useState(null); // For bedspace list

  const dispatch = useDispatch();
  const { agreementsByUnitId, isLoading } = useSelector((state) => state.agreements);
  const { dataByBuildingId } = useSelector((state) => state.units);
  const { user } = useContext(UserContext);
  
  const agreements = agreementsByUnitId[unitId] || [];
  const activeAgreements = useMemo(() => agreements.filter(a => a.isActive), [agreements]);
  
  // Logic: Are we dealing with 1 tenant or multiple bedspaces?
  const isBedspace = activeAgreements.some(a => a.rentingType === 'By Bedspace');
  const primaryAgreement = activeAgreements[0]; // For 'By Unit' scenarios

  // Get unit data - try to find it from agreements or from units store
  const unit = useMemo(() => {
    if (primaryAgreement?.unit && typeof primaryAgreement.unit === 'object') {
      return primaryAgreement.unit;
    }
    // Try to find unit from units store
    for (const buildingId in dataByBuildingId) {
      const unit = dataByBuildingId[buildingId].find(u => u._id === unitId);
      if (unit) return unit;
    }
    // Fallback: create a minimal unit object
    return { _id: unitId, unitNumber: 'N/A', unitType: '' };
  }, [primaryAgreement, unitId, dataByBuildingId]);

  // Get owner - use logged-in user as owner
  const owner = useMemo(() => {
    // First try to get from logged-in user (most reliable)
    if (user?.name) {
      return { name: user.name };
    }
    // Try to get owner from building if populated
    const building = unit?.building;
    if (building?.owner) {
      if (typeof building.owner === 'object' && building.owner.name) {
        return building.owner;
      }
      // If owner is just an ID string, use user as fallback
    }
    // Final fallback
    return { name: 'Property Owner' };
  }, [user, unit]);

  // Fetch on Open
  useEffect(() => {
    if (open && unitId) {
      dispatch(fetchAgreementsByUnit(unitId));
      setIsEditing(false);
    }
  }, [open, unitId, dispatch]);

  const handleEditStart = (id) => {
    setEditingAgreementId(id);
    setIsEditing(true);
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    setEditingAgreementId(null);
  };

  const PdfButton = ({ agreement, variant = "outline", size = "sm", showText = true }) => (
    <PDFDownloadLink
      document={
        <LeaseAgreementDocument 
          agreement={agreement} 
          unit={unit} 
          owner={owner} 
        />
      }
      fileName={`Lease_${agreement.tenant?.name?.replace(/\s+/g, '_') || 'Tenant'}.pdf`}
      style={{ textDecoration: "none" }}
    >
      {({ loading }) => (
        <Button variant={variant} size={size} disabled={loading} onClick={(e) => e.stopPropagation()}>
          <Download className={`h-4 w-4 ${showText ? "mr-2" : ""}`} />
          {showText && (loading ? "Generating..." : "PDF")}
        </Button>
      )}
    </PDFDownloadLink>
  );


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-4">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> 
                {isEditing ? "Edit Agreement" : "Agreement Details"}
              </DialogTitle>
              <DialogDescription>
                {isEditing ? "Update lease terms" : `Unit ID: ${unitId}`}
              </DialogDescription>
            </div>

            {/* Action Buttons (Only show in Read Mode and if Single Agreement) */}
            {!isEditing && !isBedspace && activeAgreements.length > 0 && (
              <div className="flex gap-2">
                <PdfButton agreement={primaryAgreement} />
                <Button variant="outline" size="sm" onClick={() => handleEditStart(primaryAgreement._id)}>
                  <Pencil className="h-3 w-3 mr-2" /> Edit
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* --- CONTENT AREA --- */}
        {isLoading ? (
          <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
        ) : activeAgreements.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">No active agreements found.</div>
        ) : isEditing ? (
          // 1. EDIT MODE
          (() => {
            const editingAgreement = activeAgreements.find(a => a._id === editingAgreementId);
            if (!editingAgreement) {
              return (
                <div className="py-8 text-center text-muted-foreground">
                  Agreement not found. It may have been removed.
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => setIsEditing(false)}
                  >
                    Close
                  </Button>
                </div>
              );
            }
            return (
              <AgreementEditForm 
                agreement={editingAgreement}
                unitId={unitId}
                onCancel={() => setIsEditing(false)}
                onSuccess={handleEditSuccess}
              />
            );
          })()
        ) : isBedspace ? (
          // 2. BEDSPACE LIST MODE
          <div className="space-y-3 mt-4">
            {activeAgreements.map(agreement => (
              <Card key={agreement._id} className={`transition-all ${expandedId === agreement._id ? 'ring-1 ring-primary' : ''}`}>
                <CardHeader 
                  className="p-4 cursor-pointer flex flex-row items-center justify-between"
                  onClick={() => setExpandedId(expandedId === agreement._id ? null : agreement._id)}
                >
                  <AgreementView agreement={agreement} isCompact={true} />
                  <div className="flex items-center gap-2">
                    <PdfButton agreement={agreement} variant="ghost" size="sm" showText={false} />
                    <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEditStart(agreement._id); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {expandedId === agreement._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardHeader>
                {expandedId === agreement._id && (
                  <CardContent className="p-4 pt-0 border-t bg-gray-50/50">
                    <div className="pt-4 flex items-center justify-between mb-4">
                      <AgreementView agreement={agreement} />
                      <PdfButton agreement={agreement} />
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          // 3. SINGLE AGREEMENT MODE
          <div className="mt-4">
             <AgreementView agreement={primaryAgreement} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}