import { Label } from "@/components/ui/label";

export default function RentingTypeField({ formik, isUnitOccupied }) {
  const isError = (field) =>
    formik.touched[field] && formik.errors[field];

  return (
    <div className="grid gap-2">
      <Label htmlFor="rentingType">Renting Type</Label>
      <select
        id="rentingType"
        name="rentingType"
        value={formik.values.rentingType}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="border rounded-md px-3 py-2 text-sm"
      >
        <option value="By Unit" disabled={isUnitOccupied}>
          By Unit
        </option>
        <option value="By Bedspace">By Bedspace</option>
      </select>
      {isError("rentingType") && (
        <span className="text-xs text-red-500">
          {formik.errors.rentingType}
        </span>
      )}
      {isUnitOccupied && (
        <span className="text-xs text-amber-600">
          Unit is already occupied. Only "By Bedspace" is available.
        </span>
      )}
    </div>
  );
}

