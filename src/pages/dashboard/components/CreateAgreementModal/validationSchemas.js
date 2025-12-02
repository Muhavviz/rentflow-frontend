import * as Yup from "yup";

export const createAgreementSchema = (hasEmergencyContact, hasIdProof) =>
  Yup.object({
    rentingType: Yup.string()
      .oneOf(["By Unit", "By Bedspace"])
      .required("Renting type is required"),
    tenantId: Yup.string().required("Tenant is required"),
    rentAmount: Yup.number()
      .typeError("Rent must be a number")
      .required("Rent is required")
      .min(0, "Rent must be a positive number"),
    securityDeposit: Yup.number()
      .typeError("Security deposit must be a number")
      .min(0, "Security deposit must be a positive number")
      .optional(),
    emergencyContact: hasEmergencyContact
      ? Yup.object({
          name: Yup.string().required("Emergency contact name is required"),
          phone: Yup.string()
            .required("Emergency contact phone is required")
            .length(10, "Phone number must be exactly 10 digits")
            .matches(/^[0-9]+$/, "Phone number must contain only digits"),
        }).required()
      : Yup.object().optional(),
    idProof: hasIdProof
      ? Yup.object({
          type: Yup.string().required("ID proof type is required"),
          number: Yup.string().required("ID proof number is required"),
          url: Yup.string()
            .required("ID proof URL is required")
            .url("Must be a valid URL"),
        }).required()
      : Yup.object().optional(),
    otherOccupants: Yup.array()
      .of(
        Yup.object({
          name: Yup.string().required("Occupant name is required"),
          relationship: Yup.string().required("Relationship is required"),
        })
      )
      .optional(),
    leaseStartDate: Yup.date().required("Lease start date is required"),
    leaseEndDate: Yup.date()
      .required("Lease end date is required")
      .min(Yup.ref("leaseStartDate"), "End date must be after start date"),
    rentDueDate: Yup.number()
      .required("Rent due date is required")
      .min(1, "Rent due date must be between 1 and 31")
      .max(31, "Rent due date must be between 1 and 31")
      .integer("Rent due date must be a whole number"),
  });

export const tenantCreateSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(35, "Name must be less than 35 characters"),
  email: Yup.string()
    .email("Must be a valid email")
    .required("Email is required"),
  phone: Yup.string()
    .length(10, "Phone number must be exactly 10 digits")
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .required("Phone is required"),
});

