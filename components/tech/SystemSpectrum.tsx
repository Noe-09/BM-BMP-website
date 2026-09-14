import type { TechSystemFamily } from "@/content/tech";

type SystemSpectrumProps = {
  families: readonly TechSystemFamily[];
};

export function SystemSpectrum({ families }: SystemSpectrumProps) {
  return (
    <section className="tech-system-spectrum" aria-labelledby="tech-system-spectrum-title">
      <header className="tech-system-spectrum__heading">
        <p>PRACTICE MAP / 01—07</p>
        <h2 id="tech-system-spectrum-title">SYSTEM FAMILIES</h2>
        <p>TOOLS BUILT AROUND HOW BUSINESSES ACTUALLY WORK.</p>
      </header>
      <ul className="tech-system-spectrum__map">
        {families.map((family) => (
          <li key={family.id} className="tech-system-spectrum__family">
            <h3>{family.name}</h3>
            <ol aria-label={`${family.name} causal sequence`}>
              {family.causalSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p>{family.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
