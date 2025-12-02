import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function EmergencyContactSection({
  showEmergencyContact,
  setShowEmergencyContact,
  formik,
}) {
  const isNestedError = (field, nestedField) => {
    const touched = formik.touched[field]?.[nestedField];
    const error = formik.errors[field]?.[nestedField];
    return touched && error;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Emergency Contact (Optional)</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowEmergencyContact(!showEmergencyContact);
            if (showEmergencyContact) {
              formik.setFieldValue("emergencyContact", {
                name: "",
                phone: "",
              });
            }
          }}
        >
          {showEmergencyContact ? "Remove" : "Add"}
        </Button>
      </div>
      {showEmergencyContact && (
        <Card className="p-4 space-y-3">
          <div className="grid gap-2">
            <Label htmlFor="emergencyContactName">Name</Label>
            <Input
              id="emergencyContactName"
              name="emergencyContact.name"
              value={formik.values.emergencyContact?.name || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                isNestedError("emergencyContact", "name")
                  ? "border-red-500"
                  : ""
              }
            />
            {isNestedError("emergencyContact", "name") && (
              <span className="text-xs text-red-500">
                {formik.errors.emergencyContact?.name}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emergencyContactPhone">Phone</Label>
            <Input
              id="emergencyContactPhone"
              name="emergencyContact.phone"
              value={formik.values.emergencyContact?.phone || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="10 digits"
              maxLength="10"
              className={
                isNestedError("emergencyContact", "phone")
                  ? "border-red-500"
                  : ""
              }
            />
            {isNestedError("emergencyContact", "phone") && (
              <span className="text-xs text-red-500">
                {formik.errors.emergencyContact?.phone}
              </span>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

