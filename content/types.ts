export type ContentStatus =
  | "APPROVED_COPY"
  | "STRUCTURED_DATA"
  | "MISSING_CONTENT"
  | "NEEDS_ASSET";

export type ApprovedCopy<T> = {
  status: "APPROVED_COPY";
  value: T;
  source: string;
  reviewNote?: string;
};

export type StructuredData<T> = {
  status: "STRUCTURED_DATA";
  value: T;
  source: string;
  reviewNote?: string;
};

export type MissingContent = {
  status: "MISSING_CONTENT" | "NEEDS_ASSET";
  value: null;
  source: string;
  reviewNote: string;
};

export type ContentField<T> =
  | ApprovedCopy<T>
  | StructuredData<T>
  | MissingContent;

export type CTA = {
  label: ApprovedCopy<string>;
  href: StructuredData<string>;
};

export type AssetReference = {
  src: string | null;
  alt: string | null;
  kind: "image" | "video" | "screen" | "process" | "demo";
  status: "verified" | "candidate" | "NEEDS_ASSET";
};

export function approvedCopy<T>(value: T, source: string): ApprovedCopy<T> {
  return { status: "APPROVED_COPY", value, source };
}

export function structuredData<T>(value: T, source: string): StructuredData<T> {
  return { status: "STRUCTURED_DATA", value, source };
}

export function missingContent(
  reviewNote: string,
  source: string,
): MissingContent {
  return { status: "MISSING_CONTENT", value: null, source, reviewNote };
}

export function needsAsset(reviewNote: string, source: string): MissingContent {
  return { status: "NEEDS_ASSET", value: null, source, reviewNote };
}

export function hasContentValue<T>(
  field: ContentField<T>,
): field is ApprovedCopy<T> | StructuredData<T> {
  return field.status === "APPROVED_COPY" || field.status === "STRUCTURED_DATA";
}
