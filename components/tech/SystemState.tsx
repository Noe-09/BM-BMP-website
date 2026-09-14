import type { TechStateRecord } from "@/content/tech";

type SystemStateProps = {
  stateRecords: readonly TechStateRecord[];
};

export function SystemState({ stateRecords }: SystemStateProps) {
  return (
    <section aria-labelledby="tech-system-state-title">
      <h2 id="tech-system-state-title">SYSTEM STATE</h2>
      <ul>
        {stateRecords.map((record) => (
          <li key={record.id}>
            <strong>{record.label}</strong>
            <span>{record.state}</span>
            <p>{record.stateNote}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
