import type { TechStateRecord } from "@/content/tech";

type SystemStateProps = {
  stateRecords: readonly TechStateRecord[];
};

export function SystemState({ stateRecords }: SystemStateProps) {
  return (
    <section className="tech-system-state" aria-labelledby="tech-system-state-title" data-tech-phase-anchor="state">
      <header className="tech-system-state__heading">
        <p>FLAGSHIP / BUILD LEDGER</p>
        <h2 id="tech-system-state-title">SYSTEM STATE</h2>
        <p>WHAT IS DESIGNED. WHAT IS PLANNED. WHAT GETS BUILT NEXT.</p>
      </header>
      <ul className="tech-system-state__records">
        {stateRecords.map((record) => (
          <li
            key={record.id}
            className="tech-system-state__record"
            data-state-record-state={record.state}
          >
            <strong>{record.label}</strong>
            <span aria-label={`Build state: ${record.state}`}>{record.state.toUpperCase()}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
