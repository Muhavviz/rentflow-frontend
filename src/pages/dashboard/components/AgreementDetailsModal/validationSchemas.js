import * as Yup from "yup";

export const updateAgreementSchema = (hasEmergencyContact, hasIdProof, originalLeaseStartDate) =>
  Yup.object({
    rentingType: Yup.string()
      .oneOf(["By Unit", "By Bedspace"])
      .optional(),
    rentAmount: Yup.number()
      .typeError("Rent must be a number")
      .min(0, "Rent must be a positive number")
      .optional(),
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
    leaseEndDate: originalLeaseStartDate
      ? Yup.date()
          .min(
            originalLeaseStartDate,
            "End date must be after start date"
          )
          .optional()
      : Yup.date().optional(),
    rentDueDate: Yup.number()
      .min(1, "Rent due date must be between 1 and 31")
      .max(31, "Rent due date must be between 1 and 31")
      .integer("Rent due date must be a whole number")
      .optional(),
  });

