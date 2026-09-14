import type { TechSystemFamily } from "@/content/tech";

type SystemSpectrumProps = {
  families: readonly TechSystemFamily[];
};

export function SystemSpectrum({ families }: SystemSpectrumProps) {
  return (
    <section aria-labelledby="tech-system-spectrum-title">
      <h2 id="tech-system-spectrum-title">SYSTEM SPECTRUM</h2>
      <ul>
        {families.map((family) => (
          <li key={family.id}>
            <h3>{family.name}</h3>
            <p>{family.causalSteps.join(" / ")}</p>
            <p>{family.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
