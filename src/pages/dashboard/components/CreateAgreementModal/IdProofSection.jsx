import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function IdProofSection({ showIdProof, setShowIdProof, formik }) {
  const isNestedError = (field, nestedField) => {
    const touched = formik.touched[field]?.[nestedField];
    const error = formik.errors[field]?.[nestedField];
    return touched && error;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>ID Proof (Optional)</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowIdProof(!showIdProof);
            if (showIdProof) {
              formik.setFieldValue("idProof", {
                type: "",
                number: "",
                url: "",
              });
            }
          }}
        >
          {showIdProof ? "Remove" : "Add"}
        </Button>
      </div>
      {showIdProof && (
        <Card className="p-4 space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="idProofType">ID Type</Label>
            <Input
              id="idProofType"
              name="idProof.type"
              value={formik.values.idProof?.type || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. Aadhaar, PAN, Passport"
              className={
                isNestedError("idProof", "type") ? "border-red-500" : ""
              }
            />
            {isNestedError("idProof", "type") && (
              <span className="text-xs text-red-500">
                {formik.errors.idProof?.type}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="idProofNumber">ID Number</Label>
            <Input
              id="idProofNumber"
              name="idProof.number"
              value={formik.values.idProof?.number || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                isNestedError("idProof", "number") ? "border-red-500" : ""
              }
            />
            {isNestedError("idProof", "number") && (
              <span className="text-xs text-red-500">
                {formik.errors.idProof?.number}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="idProofUrl">ID Proof URL</Label>
            <Input
              id="idProofUrl"
              name="idProof.url"
              type="url"
              value={formik.values.idProof?.url || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="https://example.com/id-proof.pdf"
              className={
                isNestedError("idProof", "url") ? "border-red-500" : ""
              }
            />
            {isNestedError("idProof", "url") && (
              <span className="text-xs text-red-500">
                {formik.errors.idProof?.url}
              </span>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

