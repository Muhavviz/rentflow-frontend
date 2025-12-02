import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AgreementFormFields({ formik }) {
  const isError = (field) =>
    formik.touched[field] && formik.errors[field];

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="rentAmount">Rent Amount</Label>
        <Input
          id="rentAmount"
          name="rentAmount"
          type="number"
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
        <Label htmlFor="securityDeposit">Security Deposit (Optional)</Label>
        <Input
          id="securityDeposit"
          name="securityDeposit"
          type="number"
          placeholder="e.g. 30000"
          value={formik.values.securityDeposit}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={
            isError("securityDeposit") ? "border-red-500" : ""
          }
        />
        {isError("securityDeposit") && (
          <span className="text-xs text-red-500">
            {formik.errors.securityDeposit}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="leaseStartDate">Lease Start Date</Label>
        <Input
          id="leaseStartDate"
          name="leaseStartDate"
          type="date"
          value={formik.values.leaseStartDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={isError("leaseStartDate") ? "border-red-500" : ""}
        />
        {isError("leaseStartDate") && (
          <span className="text-xs text-red-500">
            {formik.errors.leaseStartDate}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="leaseEndDate">Lease End Date</Label>
        <Input
          id="leaseEndDate"
          name="leaseEndDate"
          type="date"
          value={formik.values.leaseEndDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={isError("leaseEndDate") ? "border-red-500" : ""}
        />
        {isError("leaseEndDate") && (
          <span className="text-xs text-red-500">
            {formik.errors.leaseEndDate}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="rentDueDate">Rent Due Date (Day of Month)</Label>
        <Input
          id="rentDueDate"
          name="rentDueDate"
          type="number"
          min="1"
          max="31"
          placeholder="e.g. 5"
          value={formik.values.rentDueDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={isError("rentDueDate") ? "border-red-500" : ""}
        />
        {isError("rentDueDate") && (
          <span className="text-xs text-red-500">
            {formik.errors.rentDueDate}
          </span>
        )}
      </div>
    </>
  );
}

