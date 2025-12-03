import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAgreementsByUnit } from "@/slices/agreement-slice";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loader2, FileText, Pencil, ChevronDown, ChevronUp } from "lucide-react";

// Import our new clean components
import AgreementView from "./AgreementDetailsModal/AgreementView";
import AgreementEditForm from "./AgreementDetailsModal/AgreementEditForm";

export default function AgreementDetailsModal({ children, unitId }) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAgreementId, setEditingAgreementId] = useState(null);
  const [expandedId, setExpandedId] = useState(null); // For bedspace list

  const dispatch = useDispatch();
  const { agreementsByUnitId, isLoading } = useSelector((state) => state.agreements);
  
  const agreements = agreementsByUnitId[unitId] || [];
  const activeAgreements = useMemo(() => agreements.filter(a => a.isActive), [agreements]);
  
  // Logic: Are we dealing with 1 tenant or multiple bedspaces?
  const isBedspace = activeAgreements.some(a => a.rentingType === 'By Bedspace');
  const primaryAgreement = activeAgreements[0]; // For 'By Unit' scenarios

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
            
            {/* Edit Button (Only show in Read Mode and if Single Agreement) */}
            {!isEditing && !isBedspace && activeAgreements.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => handleEditStart(primaryAgreement._id)}>
                <Pencil className="h-3 w-3 mr-2" /> Edit
              </Button>
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
          <AgreementEditForm 
            agreement={activeAgreements.find(a => a._id === editingAgreementId)}
            unitId={unitId}
            onCancel={() => setIsEditing(false)}
            onSuccess={handleEditSuccess}
          />
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
                    <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEditStart(agreement._id); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {expandedId === agreement._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardHeader>
                {expandedId === agreement._id && (
                  <CardContent className="p-4 pt-0 border-t bg-gray-50/50">
                    <div className="pt-4"><AgreementView agreement={agreement} /></div>
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