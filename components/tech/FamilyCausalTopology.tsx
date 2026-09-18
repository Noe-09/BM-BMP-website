import type { TechSystemFamily } from "@/content/tech";

type FamilyCausalTopologyProps = {
  topology: TechSystemFamily["topology"];
};

const TOPOLOGIES: Record<
  TechSystemFamily["topology"],
  { paths: readonly string[]; nodes: readonly (readonly [number, number])[] }
> = {
  sequence: {
    paths: ["M 8 10 H 92"],
    nodes: [[8, 10], [36, 10], [64, 10], [92, 10]],
  },
  branch: {
    paths: ["M 8 10 H 40", "M 40 10 L 66 4 H 92", "M 40 10 L 66 16 H 92"],
    nodes: [[8, 10], [40, 10], [66, 4], [66, 16], [92, 4], [92, 16]],
  },
  escalation: {
    paths: ["M 8 16 H 34 V 10 H 62 V 4 H 92", "M 62 10 V 16 H 92"],
    nodes: [[8, 16], [34, 16], [34, 10], [62, 10], [62, 4], [92, 4], [92, 16]],
  },
  gate: {
    paths: ["M 8 10 H 43", "M 43 10 L 56 3 L 69 10 L 56 17 Z", "M 69 10 H 92"],
    nodes: [[8, 10], [43, 10], [56, 3], [69, 10], [56, 17], [92, 10]],
  },
  feedback: {
    paths: ["M 8 5 H 86 V 15 H 22 C 13 15 8 13 8 10"],
    nodes: [[8, 5], [34, 5], [60, 5], [86, 5], [86, 15], [22, 15]],
  },
  handoff: {
    paths: ["M 8 10 H 35", "M 35 10 C 46 2 57 18 69 10", "M 69 10 H 92"],
    nodes: [[8, 10], [35, 10], [52, 10], [69, 10], [92, 10]],
  },
  iteration: {
    paths: ["M 14 10 C 14 2 86 2 86 10 C 86 18 14 18 14 10"],
    nodes: [[14, 10], [38, 3], [68, 3], [86, 10], [62, 17], [32, 17]],
  },
};

export function FamilyCausalTopology({ topology }: FamilyCausalTopologyProps) {
  const diagram = TOPOLOGIES[topology];

  return (
    <svg
      aria-hidden="true"
      className="tech-family-topology"
      data-family-topology={topology}
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 100 20"
    >
      <g className="tech-family-topology__routes">
        {diagram.paths.map((path) => (
          <path d={path} key={path} pathLength="1" />
        ))}
      </g>
      <g className="tech-family-topology__nodes">
        {diagram.nodes.map(([x, y]) => (
          <rect
            height="3"
            key={`${x}-${y}`}
            width="3"
            x={x - 1.5}
            y={y - 1.5}
          />
        ))}
      </g>
      <circle
        className="tech-family-topology__signal"
        cx={diagram.nodes[0][0]}
        cy={diagram.nodes[0][1]}
        r="1.4"
      />
    </svg>
  );
}
