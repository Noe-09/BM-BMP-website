import type { FLAGSHIP_SYSTEM, TECH } from "@/content/tech";
import type { TechSystemNode } from "@/content/tech";
import { HumanCheckpoint } from "./HumanCheckpoint";
import { SystemTopology } from "./SystemTopology";

type SystemObservatoryProps = {
  system: typeof FLAGSHIP_SYSTEM;
  tech: typeof TECH;
};

const STAGE_COPY = {
  ingest: "BUSINESS INPUT / A structured signal enters the proposed workflow.",
  normalize: "NORMALIZE / The signal is shaped into usable publishing context.",
  orchestrate: "ORCHESTRATE / Dependencies are routed before work is proposed.",
  assist: "ASSIST / A machine contribution helps form a reviewable state.",
  checkpoint: "DECIDE / Human review remains the deliberate control point.",
  execute: "EXECUTE / An approved state is planned to move toward output.",
  return: "RETURN / Feedback is planned to return to observation and adjustment.",
} as const;

export function SystemObservatory({ system, tech }: SystemObservatoryProps) {
  const stage = (node: TechSystemNode, index: number) => (
    <>
      <p className="tech-observatory__stage-index">0{index + 1}</p>
      <h3>{node.label}</h3>
      <p>{STAGE_COPY[node.id as keyof typeof STAGE_COPY]}</p>
      <p className="tech-observatory__stage-state">{node.maturity}</p>
      {node.id === "checkpoint" ? (
        <HumanCheckpoint statement={tech.checkpointStatement} />
      ) : null}
    </>
  );

  return (
    <section className="tech-observatory" aria-labelledby="tech-observatory-title">
      <div className="tech-observatory__intro">
        <p className="tech-observatory__eyebrow">{tech.eyebrow}</p>
        <h1 id="tech-observatory-title">{tech.headline}</h1>
        <p className="tech-observatory__supporting-copy">{tech.supportingCopy}</p>
      </div>

      <div className="tech-observatory__frame">
        <div className="tech-observatory__sticky">
          <div className="tech-observatory__system-heading">
            <p>{system.eyebrow}</p>
            <h2 aria-label={`AI SOCIAL MEDIA POSTING SYSTEM / ${system.name}`}>{system.name}</h2>
            <p className="tech-observatory__truth-state">{system.truthState}</p>
            <p>{system.supportingCopy}</p>
          </div>
          <SystemTopology nodes={system.nodes} routes={system.routes} />
        </div>

        <ol className="tech-observatory__stages" aria-label="Planned system stages">
          <li className="tech-observatory__stage" data-maturity={system.nodes[0].maturity} data-tech-stage="ingest">
            {stage(system.nodes[0], 0)}
          </li>
          <li className="tech-observatory__stage" data-maturity={system.nodes[1].maturity} data-tech-stage="normalize">
            {stage(system.nodes[1], 1)}
          </li>
          <li className="tech-observatory__stage" data-maturity={system.nodes[2].maturity} data-tech-stage="orchestrate">
            {stage(system.nodes[2], 2)}
          </li>
          <li className="tech-observatory__stage" data-maturity={system.nodes[3].maturity} data-tech-stage="assist">
            {stage(system.nodes[3], 3)}
          </li>
          <li className="tech-observatory__stage" data-maturity={system.nodes[4].maturity} data-tech-stage="checkpoint">
            {stage(system.nodes[4], 4)}
          </li>
          <li className="tech-observatory__stage" data-maturity={system.nodes[5].maturity} data-tech-stage="execute">
            {stage(system.nodes[5], 5)}
          </li>
          <li className="tech-observatory__stage" data-maturity={system.nodes[6].maturity} data-tech-stage="return">
            {stage(system.nodes[6], 6)}
          </li>
        </ol>
      </div>
    </section>
  );
}
