import type { TechSystemNode, TechSystemRoute } from "@/content/tech";

type SystemTopologyProps = {
  nodes: readonly TechSystemNode[];
  routes: readonly TechSystemRoute[];
};

export function SystemTopology({ nodes, routes }: SystemTopologyProps) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

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
              key={route.id}
              pathLength="1"
            />
          );
        })}
      </g>
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
              <rect height="5" width="5" x="-2.5" y="-2.5" />
            ) : (
              <circle r="2.1" />
            )}
            <text x="0" y="-4.5">{node.shortLabel}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
