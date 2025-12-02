import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

export default function OtherOccupantsSection({ formik }) {
  const addOccupant = () => {
    const currentOccupants = formik.values.otherOccupants || [];
    formik.setFieldValue("otherOccupants", [
      ...currentOccupants,
      { name: "", relationship: "" },
    ]);
  };

  const removeOccupant = (index) => {
    const currentOccupants = formik.values.otherOccupants || [];
    const newOccupants = currentOccupants.filter((_, i) => i !== index);
    formik.setFieldValue("otherOccupants", newOccupants);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Other Occupants (Optional)</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOccupant}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Occupant
        </Button>
      </div>
      {formik.values.otherOccupants &&
        formik.values.otherOccupants.length > 0 && (
          <div className="space-y-3">
            {formik.values.otherOccupants.map((occupant, index) => (
              <Card key={index} className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">
                    Occupant {index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOccupant(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`occupantName-${index}`}>Name</Label>
                  <Input
                    id={`occupantName-${index}`}
                    name={`otherOccupants[${index}].name`}
                    value={occupant.name || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                    formik.touched.otherOccupants?.[index]?.name &&
                      formik.errors.otherOccupants?.[index]?.name
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {formik.touched.otherOccupants?.[index]?.name && formik.errors.otherOccupants?.[index]?.name && (
                    <span className="text-xs text-red-500">
                      {formik.errors.otherOccupants[index].name}
                    </span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`occupantRelationship-${index}`}>
                    Relationship
                  </Label>
                  <Input
                    id={`occupantRelationship-${index}`}
                    name={`otherOccupants[${index}].relationship`}
                    value={occupant.relationship || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. Spouse, Child, Parent"
                    className={
                      formik.touched.otherOccupants?.[index]?.relationship &&
                      formik.errors.otherOccupants?.[index]?.relationship
                        ? "border-red-500"
                        : ""
                    }
                  />
                  { formik.touched.otherOccupants?.[index]?.relationship && formik.errors.otherOccupants?.[index]?.relationship && (
                    <span className="text-xs text-red-500">
                      {formik.errors.otherOccupants[index].relationship}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}

