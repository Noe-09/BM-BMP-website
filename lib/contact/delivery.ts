import type { InquiryPayload } from "./inquiry";

type FetchImplementation = typeof fetch;

export async function deliverInquiry(
  destination: string,
  inquiry: InquiryPayload,
  request: FetchImplementation = fetch,
) {
  try {
    const response = await request(destination, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        source: "bmp-website-contact",
        submittedAt: new Date().toISOString(),
        inquiry,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    return response.ok;
  } catch {
    return false;
  }
}
