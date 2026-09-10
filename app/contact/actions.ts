"use server";

import {
  EMPTY_INQUIRY,
  INQUIRY_MESSAGES,
  getInquiryDestination,
  validateInquiry,
  type InquiryFormState,
} from "@/lib/contact/inquiry";
import { deliverInquiry } from "@/lib/contact/delivery";

export async function submitInquiry(
  previousState: InquiryFormState,
  formData: FormData,
): Promise<InquiryFormState> {
  const honeypot = formData.get("companyWebsite");
  if (typeof honeypot === "string" && honeypot.trim()) {
    return {
      status: "success",
      message: INQUIRY_MESSAGES.success,
      fieldErrors: {},
      values: EMPTY_INQUIRY,
      revision: previousState.revision + 1,
    };
  }

  const result = validateInquiry(formData);
  if (!result.ok) {
    return {
      status: "validation",
      message: INQUIRY_MESSAGES.validation,
      fieldErrors: result.fieldErrors,
      values: result.data,
      revision: previousState.revision + 1,
    };
  }

  const destination = getInquiryDestination({
    BMP_INQUIRY_WEBHOOK_URL: process.env.BMP_INQUIRY_WEBHOOK_URL,
  });
  if (!destination) {
    return {
      status: "error",
      message: INQUIRY_MESSAGES.error,
      fieldErrors: {},
      values: result.data,
      revision: previousState.revision + 1,
    };
  }

  if (await deliverInquiry(destination, result.data)) {
    return {
      status: "success",
      message: INQUIRY_MESSAGES.success,
      fieldErrors: {},
      values: EMPTY_INQUIRY,
      revision: previousState.revision + 1,
    };
  }

  return {
    status: "error",
    message: INQUIRY_MESSAGES.error,
    fieldErrors: {},
    values: result.data,
    revision: previousState.revision + 1,
  };
}
