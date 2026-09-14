import type { FLAGSHIP_SYSTEM, TECH } from "@/content/tech";

type SystemObservatoryProps = {
  system: typeof FLAGSHIP_SYSTEM;
  tech: typeof TECH;
};

export function SystemObservatory({ system, tech }: SystemObservatoryProps) {
  return (
    <section aria-labelledby="tech-observatory-title">
      <p>{tech.eyebrow}</p>
      <h1 id="tech-observatory-title">{tech.headline}</h1>
      <p>{tech.supportingCopy}</p>
      <p>{system.eyebrow}</p>
      <h2>{system.name}</h2>
      <p>{system.truthState}</p>
      <p>{system.supportingCopy}</p>
    </section>
  );
}
