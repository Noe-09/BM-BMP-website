import type { TechSystemNode, TechSystemRoute } from "@/content/tech";

type SystemTopologyProps = {
  nodes: readonly TechSystemNode[];
  routes: readonly TechSystemRoute[];
};

export function SystemTopology({ nodes, routes }: SystemTopologyProps) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const checkpointNode = nodesById.get("checkpoint");

  return (
    <svg
      aria-hidden="true"
      className="tech-topology"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      <g className="tech-topology__routes">
        {routes.map((route) => {
          const from = nodesById.get(route.from);
          const to = nodesById.get(route.to);

          if (!from || !to) {
            return null;
          }

          const isReturnLoop = route.id === "return-ingest";
          const path = isReturnLoop
            ? `M ${from.x} ${from.y} C 98 96, 2 96, ${to.x} ${to.y}`
            : `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

          return (
            <path
              className="tech-topology__route"
              d={path}
              data-maturity={route.maturity}
              data-route-id={route.id}
              data-route-phase={route.phase}
              data-simulation-state="baseline"
              key={route.id}
              pathLength="1"
            />
          );
        })}
      </g>
      {checkpointNode ? (
        <g
          className="tech-topology__decision-branches"
          transform={`translate(${checkpointNode.x} ${checkpointNode.y})`}
        >
          <path d="M 0 0 L 5 -5 H 10" />
          <path d="M 0 0 H 11" />
          <path d="M 0 0 L 5 5 H 10" />
          <circle cx="10" cy="-5" r="0.9" />
          <circle cx="11" cy="0" r="0.9" />
          <circle cx="10" cy="5" r="0.9" />
        </g>
      ) : null}
      <g className="tech-topology__nodes">
        {nodes.map((node) => (
          <g
            className="tech-topology__node"
            data-maturity={node.maturity}
            data-node-id={node.id}
            data-node-type={node.type}
            data-node-phase={node.phase}
            key={node.id}
            transform={`translate(${node.x} ${node.y})`}
          >
            {node.type === "checkpoint" ? (
              <rect className="tech-topology__node-shape" height="5" transform="rotate(45)" width="5" x="-2.5" y="-2.5" />
            ) : (
              <circle className="tech-topology__node-shape" r="2.1" />
            )}
            <g className="tech-topology__glyph" data-glyph-type={node.type}>
              {node.type === "input" ? (
                <path className="tech-topology__glyph-line" d="M -7 0 H -3.5" />
              ) : null}
              {node.id === "normalize" ? (
                <rect className="tech-topology__glyph-frame" height="7.5" width="7.5" x="-3.75" y="-3.75" />
              ) : null}
              {node.id === "orchestrate" ? (
                <path className="tech-topology__glyph-branch" d="M -4 3 L 0 -1 L 4 3" />
              ) : null}
              {node.type === "assist" ? (
                <path className="tech-topology__glyph-line" d="M -1.6 0 H 1.6 M 0 -1.6 V 1.6" />
              ) : null}
              {node.type === "output" ? (
                <path className="tech-topology__glyph-line" d="M 3.5 0 H 7" />
              ) : null}
              {node.type === "feedback" ? (
                <path className="tech-topology__glyph-line" d="M -3.5 2.8 C -6 -3 3 -6 4 0" />
              ) : null}
            </g>
            <text x="0" y="-4.5">{node.shortLabel}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
