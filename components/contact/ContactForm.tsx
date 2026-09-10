import Link from "next/link";

import { CONTACT } from "@/content/contact";

export function ContactForm() {
  return (
    <div className="bmp-contact__grid">
      <form className="bmp-contact-form" data-submission-status={CONTACT.submission.status}>
        {CONTACT.fields.map((field, index) => {
          const id = `contact-${field.name.value}`;
          const commonProps = {
            id,
            name: field.name.value,
            required: field.required.value,
          };

          return (
            <div
              key={field.name.value}
              className="bmp-contact-form__field"
              data-field-index={String(index + 1).padStart(2, "0")}
            >
              <label htmlFor={id}>{field.label.value}</label>
              {field.kind.value === "textarea" ? (
                <textarea {...commonProps} rows={5} />
              ) : (
                <input
                  {...commonProps}
                  type={field.kind.value === "url" ? "url" : "text"}
                />
              )}
            </div>
          );
        })}
        <button type="submit" disabled>
          {CONTACT.primaryAction.label.value}
        </button>
      </form>

      <aside className="bmp-contact__aside">
        <Link href={CONTACT.secondaryAction.href.value} className="bmp-contact__work-link">
          <span>{CONTACT.secondaryAction.label.value}</span>
          <span aria-hidden="true">↗</span>
        </Link>
        <ol className="bmp-contact__channels">
          {CONTACT.directChannels.value.map((channel, index) => (
            <li key={channel.label}>
              <a href={channel.href} target="_blank" rel="noopener noreferrer">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{channel.label}</strong>
                <small>{channel.descriptor}</small>
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
