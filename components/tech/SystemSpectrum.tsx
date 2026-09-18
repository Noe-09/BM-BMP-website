import type { TechPracticeScope, TechSystemFamily } from "@/content/tech";
import { FamilyCausalTopology } from "./FamilyCausalTopology";

type SystemSpectrumProps = {
  families: readonly TechSystemFamily[];
  scope: TechPracticeScope;
};

export function SystemSpectrum({ families, scope }: SystemSpectrumProps) {
  return (
    <section className="tech-system-spectrum" aria-labelledby="tech-system-spectrum-title" data-tech-phase-anchor="spectrum">
      <header className="tech-system-spectrum__heading">
        <p>PRACTICE MAP / 01—07</p>
        <h2 id="tech-system-spectrum-title">SYSTEM FAMILIES</h2>
        <p>TOOLS BUILT AROUND HOW BUSINESSES ACTUALLY WORK.</p>
      </header>
      <div className="tech-system-spectrum__scope" aria-label="BM Tech delivery scope">
        <div>
          <p className="tech-system-spectrum__scope-index">DELIVERY SCOPE / 01—06</p>
          <h3>{scope.headline}</h3>
          <p>{scope.supportingCopy}</p>
        </div>
        <ol>
          {scope.deliveryScopes.map((deliveryScope, index) => (
            <li key={deliveryScope}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {deliveryScope}
            </li>
          ))}
        </ol>
      </div>
      <ul className="tech-system-spectrum__map">
        {families.map((family) => (
          <li key={family.id} className="tech-system-spectrum__family">
            <h3>{family.name}</h3>
            <FamilyCausalTopology topology={family.topology} />
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
