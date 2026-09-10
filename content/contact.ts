import { approvedCopy, missingContent, structuredData } from "./types.ts";

const SOURCE = "canonical-docx:contact";

const contactField = (
  name: string,
  label: string,
  required: boolean,
  kind: "text" | "textarea" | "url",
) => ({
  name: structuredData(name, "structured-data:contact-field"),
  label: approvedCopy(label, SOURCE),
  required: structuredData(required, "structured-data:contact-field"),
  kind: structuredData(kind, "structured-data:contact-field"),
});

export const CONTACT = {
  headline: approvedCopy("Have a problem worth solving?", SOURCE),
  body: approvedCopy(
    "Tell us what you are trying to improve, build, or simplify. We will look at the problem first and recommend a focused direction before expanding the scope.",
    SOURCE,
  ),
  fields: [
    contactField("name", "Name", true, "text"),
    contactField("business", "Business / brand", true, "text"),
    contactField("contact", "Email / contact", true, "text"),
    contactField(
      "project",
      "What are you trying to improve or build?",
      true,
      "textarea",
    ),
    contactField(
      "reference",
      "Current website / social / reference link",
      false,
      "url",
    ),
    contactField("budget", "Budget range", false, "text"),
    contactField("timeline", "Preferred timeline", false, "text"),
  ],
  primaryAction: {
    label: approvedCopy("Start a project", SOURCE),
    href: missingContent(
      "A form submission destination has not been supplied.",
      "content-gap:contact-submission",
    ),
  },
  secondaryAction: {
    label: approvedCopy("View our work", SOURCE),
    href: structuredData("/work", "approved-proposal:public-route-slugs"),
  },
  submission: missingContent(
    "Delivery mechanism, destination, and response messages are not supplied.",
    "content-gap:contact-submission",
  ),
  directChannels: structuredData(
    [
      {
        label: "Zalo",
        descriptor: "Quick conversation",
        href: "https://zalo.me/0326034128",
      },
      {
        label: "LinkedIn",
        descriptor: "Professional inquiries",
        href: "https://www.linkedin.com/in/baotran1909/",
      },
      {
        label: "Facebook",
        descriptor: "Message us",
        href: "https://www.facebook.com/profile.php?id=61567460303851",
      },
    ] as const,
    "existing-repository:app/contact/page.tsx",
  ),
} as const;
