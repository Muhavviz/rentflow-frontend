import { useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { createTenant } from "@/slices/users-slice";
import { tenantCreateSchema } from "./validationSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function CreateTenantForm({
  tenantEmail,
  setShowCreateTenant,
  setGlobalError,
  agreementFormik,
  isLoading,
}) {
  const dispatch = useDispatch();

  const tenantFormik = useFormik({
    initialValues: {
      name: "",
      email: tenantEmail,
      phone: "",
    },
    enableReinitialize: true,
    validationSchema: tenantCreateSchema,
    onSubmit: async (values, { resetForm }) => {
      setGlobalError(null);
      const action = await dispatch(createTenant(values));

      if (createTenant.rejected.match(action)) {
        const err = action.payload;
        if (err?.error && typeof err.error === "string") {
          setGlobalError(err.error);
        } else if (Array.isArray(err?.error)) {
          const errorMessages = err.error.map((e) => e.message).join(", ");
          setGlobalError(errorMessages);
        } else {
          setGlobalError("Something went wrong while creating the tenant.");
        }
        return;
      }

      agreementFormik.setFieldValue("tenantId", action.payload._id);
      setShowCreateTenant(false);
      resetForm();
    },
  });

  useEffect(() => {
    if (tenantEmail) {
      tenantFormik.setFieldValue("email", tenantEmail);
    }
  }, [tenantEmail]);

  const isTenantError = (field) =>
    tenantFormik.touched[field] && tenantFormik.errors[field];

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">Create New Tenant</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowCreateTenant(false);
            tenantFormik.resetForm();
          }}
        >
          Cancel
        </Button>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="tenantName">Name</Label>
        <Input
          id="tenantName"
          name="name"
          value={tenantFormik.values.name}
          onChange={tenantFormik.handleChange}
          onBlur={tenantFormik.handleBlur}
          className={isTenantError("name") ? "border-red-500" : ""}
        />
        {isTenantError("name") && (
          <span className="text-xs text-red-500">
            {tenantFormik.errors.name}
          </span>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="tenantEmailInput">Email</Label>
        <Input
          id="tenantEmailInput"
          name="email"
          type="email"
          value={tenantFormik.values.email}
          onChange={tenantFormik.handleChange}
          onBlur={tenantFormik.handleBlur}
          className={isTenantError("email") ? "border-red-500" : ""}
        />
        {isTenantError("email") && (
          <span className="text-xs text-red-500">
            {tenantFormik.errors.email}
          </span>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="tenantPhone">Phone</Label>
        <Input
          id="tenantPhone"
          name="phone"
          value={tenantFormik.values.phone}
          onChange={tenantFormik.handleChange}
          onBlur={tenantFormik.handleBlur}
          className={isTenantError("phone") ? "border-red-500" : ""}
        />
        {isTenantError("phone") && (
          <span className="text-xs text-red-500">
            {tenantFormik.errors.phone}
          </span>
        )}
      </div>
      <Button
        type="button"
        onClick={tenantFormik.handleSubmit}
        disabled={tenantFormik.isSubmitting || isLoading}
        className="w-full"
      >
        {tenantFormik.isSubmitting ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : (
          "Create Tenant"
        )}
      </Button>
    </Card>
  );
}

