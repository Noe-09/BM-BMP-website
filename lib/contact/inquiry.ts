export const INQUIRY_FIELD_LIMITS = {
  name: 120,
  business: 160,
  contact: 254,
  project: 4_000,
  reference: 2_048,
  budget: 160,
  timeline: 160,
} as const;

export type InquiryFieldName = keyof typeof INQUIRY_FIELD_LIMITS;

export type InquiryPayload = Record<InquiryFieldName, string>;

export const EMPTY_INQUIRY: InquiryPayload = {
  name: "",
  business: "",
  contact: "",
  project: "",
  reference: "",
  budget: "",
  timeline: "",
};

export type InquiryFieldErrors = Partial<Record<InquiryFieldName, string>>;

export type InquiryFormState = {
  status: "idle" | "validation" | "success" | "error";
  message: string;
  fieldErrors: InquiryFieldErrors;
  values: InquiryPayload;
  revision: number;
};

export const INQUIRY_MESSAGES = {
  success:
    "Thanks — your project inquiry has been received. We’ll review the problem and get back to you.",
  error:
    "We couldn’t send your project inquiry. Please try again or use one of the direct contact options.",
  validation: "Please review the highlighted fields and try again.",
} as const;

export const INITIAL_INQUIRY_STATE: InquiryFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: EMPTY_INQUIRY,
  revision: 0,
};

type InquiryValidationResult =
  | { ok: true; data: InquiryPayload; fieldErrors: InquiryFieldErrors }
  | { ok: false; data: InquiryPayload; fieldErrors: InquiryFieldErrors };

function readText(formData: FormData, name: InquiryFieldName) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateInquiry(formData: FormData): InquiryValidationResult {
  const data = Object.fromEntries(
    (Object.keys(INQUIRY_FIELD_LIMITS) as InquiryFieldName[]).map((name) => [
      name,
      readText(formData, name),
    ]),
  ) as InquiryPayload;
  const fieldErrors: InquiryFieldErrors = {};

  if (!data.name) fieldErrors.name = "Enter your name.";
  if (!data.business) fieldErrors.business = "Enter your business or brand.";
  if (!isEmail(data.contact)) fieldErrors.contact = "Enter a valid email address.";
  if (!data.project) {
    fieldErrors.project = "Tell us what you are trying to improve or build.";
  }
  if (data.reference && !isHttpUrl(data.reference)) {
    fieldErrors.reference = "Enter a complete website or reference link.";
  }

  for (const name of Object.keys(INQUIRY_FIELD_LIMITS) as InquiryFieldName[]) {
    const limit = INQUIRY_FIELD_LIMITS[name];
    if (data[name].length > limit) {
      fieldErrors[name] = `Keep this field under ${limit.toLocaleString()} characters.`;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, data, fieldErrors };
  }

  return { ok: true, data, fieldErrors: {} };
}

export function getInquiryDestination(environment: {
  BMP_INQUIRY_WEBHOOK_URL?: string;
}) {
  const value = environment.BMP_INQUIRY_WEBHOOK_URL?.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
