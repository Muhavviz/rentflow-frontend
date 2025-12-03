import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { updateAgreement, fetchAgreementsByUnit } from "@/slices/agreement-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check, X } from "lucide-react";
import { useState } from "react";
import { updateAgreementSchema } from "./validationSchemas";
// Reusing your existing sections
import EmergencyContactSection from "../CreateAgreementModal/EmergencyContactSection";
import IdProofSection from "../CreateAgreementModal/IdProofSection";
import OtherOccupantsSection from "../CreateAgreementModal/OtherOccupantsSection";

export default function AgreementEditForm({ agreement, unitId, onCancel, onSuccess }) {
  const dispatch = useDispatch();
  const [globalError, setGlobalError] = useState(null);
  
  // Early return if agreement is undefined
  if (!agreement) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Agreement not found. It may have been removed.
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={onCancel}
        >
          Close
        </Button>
      </div>
    );
  }
  
  // Toggles for optional sections
  const [showEmergencyContact, setShowEmergencyContact] = useState(
    !!(agreement?.emergencyContact?.name || agreement?.emergencyContact?.phone)
  );
  const [showIdProof, setShowIdProof] = useState(
    !!(agreement?.idProof?.type || agreement?.idProof?.number)
  );

  const formik = useFormik({
    initialValues: {
      rentAmount: agreement?.rentAmount || "",
      securityDeposit: agreement?.securityDeposit || "",
      leaseEndDate: agreement?.leaseEndDate ? agreement.leaseEndDate.split("T")[0] : "",
      rentDueDate: agreement?.rentDueDate || "",
      rentingType: agreement?.rentingType || "By Unit",
      emergencyContact: agreement?.emergencyContact || { name: "", phone: "" },
      idProof: agreement?.idProof || { type: "", number: "", url: "" },
      otherOccupants: agreement?.otherOccupants || [],
    },
    validationSchema: updateAgreementSchema(showEmergencyContact, showIdProof, agreement?.leaseStartDate),
    onSubmit: async (values) => {
      setGlobalError(null);
      
      // Prepare Payload (Clean up numbers and dates)
      const payload = {
        rentAmount: Number(values.rentAmount),
        securityDeposit: Number(values.securityDeposit),
        leaseEndDate: new Date(values.leaseEndDate).toISOString(),
        rentDueDate: Number(values.rentDueDate),
        rentingType: values.rentingType,
        ...(showEmergencyContact && { emergencyContact: values.emergencyContact }),
        ...(showIdProof && { idProof: values.idProof }),
        otherOccupants: values.otherOccupants
      };

      const result = await dispatch(updateAgreement({ agreementId: agreement?._id, formData: payload }));

      if (updateAgreement.fulfilled.match(result)) {
        dispatch(fetchAgreementsByUnit(unitId)); // Refresh data
        onSuccess();
      } else {
        setGlobalError(result.payload?.error || "Update failed");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 px-1">
      {globalError && <p className="text-sm text-red-500 font-medium">{globalError}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Rent Amount</Label>
          <Input 
            type="number" {...formik.getFieldProps('rentAmount')} 
            className={formik.touched.rentAmount && formik.errors.rentAmount ? "border-red-500" : ""}
          />
        </div>
        <div className="space-y-2">
          <Label>Security Deposit</Label>
          <Input type="number" {...formik.getFieldProps('securityDeposit')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 opacity-60 cursor-not-allowed">
          <Label>Lease Start (Locked)</Label>
          <Input value={agreement?.leaseStartDate ? agreement.leaseStartDate.split("T")[0] : ""} disabled />
        </div>
        <div className="space-y-2">
          <Label>Lease End</Label>
          <Input 
            type="date" {...formik.getFieldProps('leaseEndDate')} 
            className={formik.touched.leaseEndDate && formik.errors.leaseEndDate ? "border-red-500" : ""}
          />
        </div>
      </div>

      <EmergencyContactSection 
        showEmergencyContact={showEmergencyContact} 
        setShowEmergencyContact={setShowEmergencyContact} 
        formik={formik} 
      />
      <IdProofSection 
        showIdProof={showIdProof} 
        setShowIdProof={setShowIdProof} 
        formik={formik} 
      />
      <OtherOccupantsSection formik={formik} />

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}