import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  createAgreement,
  resetAgreementError,
  fetchAgreementsByUnit,
} from "@/slices/agreement-slice";
import { clearSearchedTenant, resetUserError } from "@/slices/users-slice";
import { fetchUnitsByBuilding } from "@/slices/units-slice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { createAgreementSchema } from "./CreateAgreementModal/validationSchemas";
import RentingTypeField from "./CreateAgreementModal/RentingTypeField";
import TenantSearchSection from "./CreateAgreementModal/TenantSearchSection";
import CreateTenantForm from "./CreateAgreementModal/CreateTenantForm";
import AgreementFormFields from "./CreateAgreementModal/AgreementFormFields";
import EmergencyContactSection from "./CreateAgreementModal/EmergencyContactSection";
import IdProofSection from "./CreateAgreementModal/IdProofSection";
import OtherOccupantsSection from "./CreateAgreementModal/OtherOccupantsSection";

export default function CreateAgreementModal({ children, unit, buildingId }) {
  const [open, setOpen] = useState(false);
  const [tenantEmail, setTenantEmail] = useState("");
  const [showCreateTenant, setShowCreateTenant] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);
  const [showIdProof, setShowIdProof] = useState(false);
  const dispatch = useDispatch();

  const { searchedTenant } = useSelector((state) => state.users);
  const { isLoading: agreementLoading } = useSelector((state) => state.agreements);

  const isUnitOccupied = unit?.status === "occupied";
  const defaultRentingType = isUnitOccupied ? "By Bedspace" : "By Unit";

  const agreementSchema = useMemo(
    () => createAgreementSchema(showEmergencyContact, showIdProof),
    [showEmergencyContact, showIdProof]
  );

  const agreementFormik = useFormik({
    initialValues: {
      rentingType: defaultRentingType,
      tenantId: "",
      rentAmount: "",
      securityDeposit: "",
      emergencyContact: {
        name: "",
        phone: "",
      },
      idProof: {
        type: "",
        number: "",
        url: "",
      },
      otherOccupants: [],
      leaseStartDate: "",
      leaseEndDate: "",
      rentDueDate: "",
    },
    enableReinitialize: true,
    validationSchema: agreementSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      setGlobalError(null);
      if (!unit?._id) {
        setGlobalError("Unit information is missing");
        return;
      }

      const payload = {
        unit: unit._id,
        tenant: values.tenantId,
        rentingType: values.rentingType,
        rentAmount: Number(values.rentAmount),
        securityDeposit: values.securityDeposit
          ? Number(values.securityDeposit)
          : 0,
        leaseStartDate: new Date(values.leaseStartDate).toISOString(),
        leaseEndDate: new Date(values.leaseEndDate).toISOString(),
        rentDueDate: Number(values.rentDueDate),
      };

      if (showEmergencyContact && values.emergencyContact?.name && values.emergencyContact?.phone) {
        payload.emergencyContact = {
          name: values.emergencyContact.name.trim(),
          phone: values.emergencyContact.phone.trim(),
        };
      }

      if (showIdProof && values.idProof?.type && values.idProof?.number && values.idProof?.url) {
        payload.idProof = {
          type: values.idProof.type.trim(),
          number: values.idProof.number.trim(),
          url: values.idProof.url.trim(),
        };
      }

      if (values.otherOccupants && values.otherOccupants.length > 0) {
        payload.otherOccupants = values.otherOccupants
          .filter((occ) => occ.name && occ.relationship)
          .map((occ) => ({
            name: occ.name.trim(),
            relationship: occ.relationship.trim(),
          }));
      }

      const action = await dispatch(createAgreement(payload));

      if (createAgreement.rejected.match(action)) {
        const err = action.payload;
        if (err?.error && typeof err.error === "string") {
          setGlobalError(err.error);
        } else if (Array.isArray(err?.error)) {
          const errorMessages = err.error.map((e) => e.message).join(", ");
          setGlobalError(errorMessages);
        } else {
          setGlobalError("Something went wrong while creating the agreement.");
        }
        return;
      }

      resetForm();
      setTenantEmail("");
      setShowCreateTenant(false);
      dispatch(clearSearchedTenant());
      setOpen(false);

      const buildingIdToRefresh = buildingId || unit?.building;
      if (buildingIdToRefresh) {
        dispatch(fetchUnitsByBuilding(buildingIdToRefresh));
      }

      if (unit?._id) {
        dispatch(fetchAgreementsByUnit(unit._id));
      }
    },
  });


  useEffect(() => {
    if (searchedTenant) {
      agreementFormik.setFieldValue("tenantId", searchedTenant._id);
    }
  }, [searchedTenant]);


  useEffect(() => {
    if (!open) {
      setGlobalError(null);
      setTenantEmail("");
      setShowCreateTenant(false);
      dispatch(clearSearchedTenant());
      dispatch(resetAgreementError());
      dispatch(resetUserError());
      setShowEmergencyContact(false);
      setShowIdProof(false);
      agreementFormik.resetForm({
        values: {
          rentingType: defaultRentingType,
          tenantId: "",
          rentAmount: "",
          securityDeposit: "",
          emergencyContact: {
            name: "",
            phone: "",
          },
          idProof: {
            type: "",
            number: "",
            url: "",
          },
          otherOccupants: [],
          leaseStartDate: "",
          leaseEndDate: "",
          rentDueDate: "",
        },
      });
    }
  }, [open, dispatch, defaultRentingType]);

  const isLoading = agreementLoading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rent Unit</DialogTitle>
          <DialogDescription>
            Create a new rental agreement for {unit?.unitNumber || "this unit"}.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={agreementFormik.handleSubmit}
          className="space-y-4 py-4"
        >
          {globalError && (
            <p className="text-sm text-red-500 mb-2">{globalError}</p>
          )}

          <RentingTypeField
            formik={agreementFormik}
            isUnitOccupied={isUnitOccupied}
          />

          <TenantSearchSection
            tenantEmail={tenantEmail}
            setTenantEmail={setTenantEmail}
            showCreateTenant={showCreateTenant}
            setShowCreateTenant={setShowCreateTenant}
            setGlobalError={setGlobalError}
            formik={agreementFormik}
            isLoading={isLoading}
          />

          {showCreateTenant && (
            <CreateTenantForm
              tenantEmail={tenantEmail}
              setShowCreateTenant={setShowCreateTenant}
              setGlobalError={setGlobalError}
              agreementFormik={agreementFormik}
              isLoading={isLoading}
            />
          )}

          {agreementFormik.values.tenantId && (
            <>
              <AgreementFormFields formik={agreementFormik} />

              <EmergencyContactSection
                showEmergencyContact={showEmergencyContact}
                setShowEmergencyContact={setShowEmergencyContact}
                formik={agreementFormik}
              />

              <IdProofSection
                showIdProof={showIdProof}
                setShowIdProof={setShowIdProof}
                formik={agreementFormik}
              />

              <OtherOccupantsSection formik={agreementFormik} />
            </>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={
                isLoading ||
                agreementFormik.isSubmitting ||
                !agreementFormik.values.tenantId
              }
            >
              {agreementLoading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Create Agreement"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

