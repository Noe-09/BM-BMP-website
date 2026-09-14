import type { TECH } from "@/content/tech";

type SystemPracticeTransitionProps = {
  tech: typeof TECH;
};

export function SystemPracticeTransition({ tech }: SystemPracticeTransitionProps) {
  return (
    <section className="tech-practice-transition" aria-label="From one system to the wider practice">
      <div className="tech-practice-transition__signal" aria-hidden="true" />
      <div className="tech-practice-transition__copy">
        {tech.transitionStatement.map((statement) => (
          <p key={statement}>{statement}</p>
        ))}
      </div>
    </section>
  );
}
