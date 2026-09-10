import assert from "node:assert/strict";
import test from "node:test";

import { deliverInquiry } from "../lib/contact/delivery.ts";
import {
  EMPTY_INQUIRY,
  INQUIRY_MESSAGES,
  getInquiryDestination,
  validateInquiry,
} from "../lib/contact/inquiry.ts";

function validInquiry(overrides = {}) {
  const values = {
    name: "Noe",
    business: "BMP",
    contact: "noe@example.com",
    project: "We need a clearer project inquiry experience.",
    reference: "https://example.com/current",
    budget: "USD 5k–10k",
    timeline: "This quarter",
    ...overrides,
  };
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) formData.set(key, value);
  return formData;
}

test("contact inquiry accepts every canonical field and optional blanks", () => {
  assert.deepEqual(Object.keys(EMPTY_INQUIRY), [
    "name",
    "business",
    "contact",
    "project",
    "reference",
    "budget",
    "timeline",
  ]);
  const complete = validateInquiry(validInquiry());
  assert.equal(complete.ok, true);
  assert.deepEqual(Object.keys(complete.data), [
    "name",
    "business",
    "contact",
    "project",
    "reference",
    "budget",
    "timeline",
  ]);

  const optionalBlank = validateInquiry(
    validInquiry({ reference: "", budget: "", timeline: "" }),
  );
  assert.equal(optionalBlank.ok, true);
});

test("contact inquiry rejects missing required fields with field-level errors", () => {
  const result = validateInquiry(
    validInquiry({ name: "", business: "", contact: "", project: "" }),
  );

  assert.equal(result.ok, false);
  assert.equal(result.data.name, "");
  assert.equal(result.data.project, "");
  assert.deepEqual(Object.keys(result.fieldErrors), [
    "name",
    "business",
    "contact",
    "project",
  ]);
});

test("contact inquiry validates email and optional URL formats", () => {
  const badEmail = validateInquiry(validInquiry({ contact: "not-an-email" }));
  assert.equal(badEmail.ok, false);
  assert.match(badEmail.fieldErrors.contact, /email/i);

  const badUrl = validateInquiry(validInquiry({ reference: "example dot com" }));
  assert.equal(badUrl.ok, false);
  assert.match(badUrl.fieldErrors.reference, /link|URL/i);
});

test("delivery configuration accepts only one explicit HTTPS webhook value", () => {
  assert.equal(getInquiryDestination({}), null);
  assert.equal(
    getInquiryDestination({ BMP_INQUIRY_WEBHOOK_URL: "http://example.com/hook" }),
    null,
  );
  assert.equal(
    getInquiryDestination({ BMP_INQUIRY_WEBHOOK_URL: "https://example.com/hook" }),
    "https://example.com/hook",
  );
});

test("operational messages remain truthful about delivery", () => {
  assert.equal(
    INQUIRY_MESSAGES.success,
    "Thanks — your project inquiry has been received. We’ll review the problem and get back to you.",
  );
  assert.doesNotMatch(INQUIRY_MESSAGES.error, /received|sent successfully/i);
});

test("configured delivery succeeds only after a successful provider response", async () => {
  const inquiry = validateInquiry(validInquiry()).data;
  const accepted = await deliverInquiry(
    "https://example.com/hook",
    inquiry,
    async () => new Response(null, { status: 202 }),
  );
  const rejected = await deliverInquiry(
    "https://example.com/hook",
    inquiry,
    async () => new Response(null, { status: 503 }),
  );

  assert.equal(accepted, true);
  assert.equal(rejected, false);
});
