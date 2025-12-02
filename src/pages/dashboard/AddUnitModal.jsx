import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { createUnit, updateUnit } from "@/slices/units-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";

const unitSchema = Yup.object({
  unitNumber: Yup.string().required("Unit number is required"),
  floorNumber: Yup.string().nullable(),
  rentAmount: Yup.number()
    .typeError("Rent must be a number")
    .required("Rent is required")
    .min(0, "Rent must be a positive number"),
  unitType: Yup.string().required("Unit type is required"),
  status: Yup.string().required("Status is required"),
});

export default function AddUnitModal({ children, buildingId, unit }) {
  const [open, setOpen] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const dispatch = useDispatch();

  const isEditMode = !!unit;

  const formik = useFormik({
    initialValues: {
      unitNumber: unit?.unitNumber || "",
      floorNumber: unit?.floorNumber || "",
      rentAmount:
        typeof unit?.rentAmount === "number" ? String(unit.rentAmount) : "",
      unitType: unit?.unitType || "1BHK",
      status: unit?.status || "vacant",
    },
    enableReinitialize: true,
    validationSchema: unitSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      setGlobalError(null);
      const payload = {
        unitNumber: values.unitNumber,
        floorNumber: values.floorNumber || undefined,
        rentAmount: Number(values.rentAmount),
        unitType: values.unitType,
        status: values.status,
      };

      const action = isEditMode
        ? await dispatch(updateUnit({ id: unit._id, formData: payload }))
        : await dispatch(
            createUnit({
              ...payload,
              building: buildingId,
            })
          );

      if (createUnit.rejected.match(action) || updateUnit.rejected.match(action)) {
        const err = action.payload;
        if (err?.error && typeof err.error === "string") {
          setGlobalError(err.error);
        } else if (Array.isArray(err?.error)) {
          err.error.forEach((e) => {
            if (e.path && e.path[0]) {
              formik.setFieldError(e.path[0], e.message);
            }
          });
        } else {
          setGlobalError(
            `Something went wrong while ${isEditMode ? "updating" : "creating"} the unit.`
          );
        }
        return;
      }

      resetForm();
      setOpen(false);
    },
  });

  const isError = (field) => formik.touched[field] && formik.errors[field];

  useEffect(() => {
    if (!open) {
      setGlobalError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Unit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Unit" : "Add Unit"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details of this unit."
              : "Enter the details for a new unit in this building."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
          {globalError && (
            <p className="text-sm text-red-500 mb-2">{globalError}</p>
          )}

          <div className="grid gap-2">
            <Label htmlFor="unitNumber">Unit Number</Label>
            <Input
              id="unitNumber"
              name="unitNumber"
              placeholder="e.g. 101, A-2"
              value={formik.values.unitNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={isError("unitNumber") ? "border-red-500" : ""}
            />
            {isError("unitNumber") && (
              <span className="text-xs text-red-500">
                {formik.errors.unitNumber}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="floorNumber">Floor</Label>
            <Input
              id="floorNumber"
              name="floorNumber"
              placeholder="e.g. 1st, Ground"
              value={formik.values.floorNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rentAmount">Rent Amount</Label>
            <Input
              id="rentAmount"
              name="rentAmount"
              placeholder="e.g. 15000"
              value={formik.values.rentAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={isError("rentAmount") ? "border-red-500" : ""}
            />
            {isError("rentAmount") && (
              <span className="text-xs text-red-500">
                {formik.errors.rentAmount}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="unitType">Unit Type</Label>
            <select
              id="unitType"
              name="unitType"
              value={formik.values.unitType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
              <option value="Studio">Studio</option>
              <option value="Villa">Villa</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                isEditMode ? "Update Unit" : "Save Unit"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


