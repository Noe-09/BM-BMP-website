import { SERVICES } from "./services";

export type TechPhase =
  | "observe"
  | "ingest"
  | "normalize"
  | "orchestrate"
  | "assist"
  | "checkpoint"
  | "execute"
  | "return"
  | "state"
  | "spectrum"
  | "register"
  | "close";

export type TechMaturity = "active" | "verified" | "planned";
export type TechCapabilityState = "available";

export type TechNodeType =
  | "input"
  | "process"
  | "assist"
  | "checkpoint"
  | "output"
  | "feedback";

export type TechSystemNode = {
  id: string;
  label: string;
  shortLabel: string;
  phase: TechPhase;
  type: TechNodeType;
  maturity: TechMaturity;
  x: number;
  y: number;
  mobileOrder: number;
};

export type TechSystemRoute = {
  id: string;
  from: string;
  to: string;
  phase: TechPhase;
  maturity: TechMaturity;
};

export type TechStateRecord = {
  id: string;
  label: string;
  state: TechMaturity;
  stateNote: string;
};

export type TechSystemFamily = {
  id: string;
  name: string;
  causalSteps: readonly string[];
  description: string;
};

export type TechPracticeScope = {
  headline: string;
  supportingCopy: string;
  deliveryScopes: readonly string[];
  action: {
    label: string;
    href: string;
  };
};

export type TechRegisterRow = {
  id: string;
  systemType: string;
  businessProblem: string;
  delivery: string;
  capabilityState: TechCapabilityState;
};

export const TECH_PRACTICE_SCOPE: TechPracticeScope = {
  headline: SERVICES.tech.headline.value,
  supportingCopy: SERVICES.tech.supportingCopy.value,
  deliveryScopes: SERVICES.tech.groups.value,
  action: {
    label: SERVICES.tech.action.label.value,
    href: SERVICES.tech.action.href.value,
  },
};

export const TECH = {
  eyebrow: "BMP / TECH",
  headline: "SYSTEMS IN MOTION.",
  supportingCopy:
    "Tools and operational systems built around real business problems.",
  checkpointStatement: [
    "AUTOMATION DOESN'T REMOVE THE DECISION.",
    "IT MOVES THE DECISION TO THE RIGHT PLACE.",
  ],
  transitionStatement: [
    "ONE SYSTEM IS NOT THE PRACTICE.",
    "THE PRACTICE IS BUILDING THE RIGHT SYSTEM AROUND THE PROBLEM.",
  ],
  closingHeadline: "SHOW US THE PROCESS THAT SHOULD WORK BETTER.",
  closingCopy:
    "We build practical tools and systems around the problem, the workflow, and the people who use them.",
  action: TECH_PRACTICE_SCOPE.action,
} as const;

export const TECH_SYSTEM_FAMILIES: readonly TechSystemFamily[] = [
  {
    id: "workflow-systems",
    name: "WORKFLOW SYSTEMS",
    causalSteps: ["REPEAT", "ROUTE", "AUTOMATE", "REVIEW"],
    description: "Workflow automation and integrations.",
  },
  {
    id: "internal-tools",
    name: "INTERNAL TOOLS",
    causalSteps: ["INFORMATION", "STRUCTURE", "ACTION"],
    description: "AI-assisted and practical internal business tools.",
  },
  {
    id: "customer-systems",
    name: "CUSTOMER SYSTEMS",
    causalSteps: ["QUERY", "CLASSIFY", "RESPOND / ESCALATE"],
    description: "Customer-facing utilities and support systems.",
  },
  {
    id: "lead-systems",
    name: "LEAD SYSTEMS",
    causalSteps: ["CAPTURE", "QUALIFY", "ROUTE", "HUMAN"],
    description: "Lead handling and routing systems.",
  },
  {
    id: "operation-systems",
    name: "OPERATION SYSTEMS",
    causalSteps: ["COLLECT", "NORMALIZE", "OBSERVE", "DECIDE"],
    description: "CRM-lite and operational dashboard systems.",
  },
  {
    id: "focused-web-systems",
    name: "FOCUSED WEB SYSTEMS",
    causalSteps: ["NEED", "INTERFACE", "ACTION", "RESULT"],
    description: "Business websites and focused web systems.",
  },
  {
    id: "custom-mvps",
    name: "CUSTOM MVPs",
    causalSteps: ["PROBLEM", "PROTOTYPE", "TEST", "ITERATE"],
    description: "Custom MVPs and practical digital prototypes.",
  },
] as const;

export const FLAGSHIP_SYSTEM = {
  eyebrow: "SYSTEM PROTOTYPE 01",
  name: "AI SOCIAL MEDIA POSTING SYSTEM",
  truthState: "PROTOTYPE / PLANNED",
  supportingCopy:
    "A structured workflow for turning business inputs into reviewable publishing outputs.",
  stateHeading: "SYSTEM STATE",
  stateSupportingCopy: "WHAT IS DESIGNED. WHAT IS PLANNED. WHAT GETS BUILT NEXT.",
  nodes: [
    {
      id: "ingest",
      label: "INGEST",
      shortLabel: "IN",
      phase: "ingest",
      type: "input",
      maturity: "planned",
      x: 8,
      y: 50,
      mobileOrder: 1,
    },
    {
      id: "normalize",
      label: "NORMALIZE",
      shortLabel: "NORMAL",
      phase: "normalize",
      type: "process",
      maturity: "planned",
      x: 23,
      y: 32,
      mobileOrder: 2,
    },
    {
      id: "orchestrate",
      label: "ORCHESTRATE",
      shortLabel: "ROUTE",
      phase: "orchestrate",
      type: "process",
      maturity: "planned",
      x: 39,
      y: 55,
      mobileOrder: 3,
    },
    {
      id: "assist",
      label: "ASSIST",
      shortLabel: "ASSIST",
      phase: "assist",
      type: "assist",
      maturity: "planned",
      x: 54,
      y: 30,
      mobileOrder: 4,
    },
    {
      id: "checkpoint",
      label: "CHECKPOINT",
      shortLabel: "DECIDE",
      phase: "checkpoint",
      type: "checkpoint",
      maturity: "planned",
      x: 67,
      y: 57,
      mobileOrder: 5,
    },
    {
      id: "execute",
      label: "EXECUTE",
      shortLabel: "OUT",
      phase: "execute",
      type: "output",
      maturity: "planned",
      x: 82,
      y: 34,
      mobileOrder: 6,
    },
    {
      id: "return",
      label: "RETURN",
      shortLabel: "LOOP",
      phase: "return",
      type: "feedback",
      maturity: "planned",
      x: 92,
      y: 66,
      mobileOrder: 7,
    },
  ] as const satisfies readonly TechSystemNode[],
  routes: [
    { id: "ingest-normalize", from: "ingest", to: "normalize", phase: "ingest", maturity: "planned" },
    { id: "normalize-orchestrate", from: "normalize", to: "orchestrate", phase: "normalize", maturity: "planned" },
    { id: "orchestrate-assist", from: "orchestrate", to: "assist", phase: "orchestrate", maturity: "planned" },
    { id: "assist-checkpoint", from: "assist", to: "checkpoint", phase: "assist", maturity: "planned" },
    { id: "checkpoint-execute", from: "checkpoint", to: "execute", phase: "checkpoint", maturity: "planned" },
    { id: "execute-return", from: "execute", to: "return", phase: "execute", maturity: "planned" },
    { id: "return-ingest", from: "return", to: "ingest", phase: "return", maturity: "planned" },
  ] as const satisfies readonly TechSystemRoute[],
  stateRecords: [
    { id: "ingest", label: "INGEST", state: "planned", stateNote: "Business input is designed as a planned system entry." },
    { id: "normalize", label: "NORMALIZE", state: "planned", stateNote: "Structured input is planned for the prototype workflow." },
    { id: "orchestrate", label: "ORCHESTRATE", state: "planned", stateNote: "Routing logic is planned for the prototype workflow." },
    { id: "assist", label: "ASSIST", state: "planned", stateNote: "Machine contribution is planned as an assisted step." },
    { id: "checkpoint", label: "CHECKPOINT", state: "planned", stateNote: "Human review is planned before any output step." },
    { id: "execute", label: "EXECUTE", state: "planned", stateNote: "Output propagation is planned after a human decision." },
    { id: "return", label: "RETURN", state: "planned", stateNote: "Feedback is planned as an observation and adjustment loop." },
  ] as const satisfies readonly TechStateRecord[],
} as const;

export const TECH_REGISTER: readonly TechRegisterRow[] = [
  {
    id: "focused-web-systems",
    systemType: "FOCUSED WEB SYSTEMS",
    businessProblem: "A business needs a clear interface for a specific action.",
    delivery: "Business websites and focused web systems.",
    capabilityState: "available",
  },
  {
    id: "workflow-systems",
    systemType: "WORKFLOW SYSTEMS",
    businessProblem: "Repeated work needs clear routing and review.",
    delivery: "Workflow automation and integrations.",
    capabilityState: "available",
  },
  {
    id: "internal-tools",
    systemType: "INTERNAL TOOLS",
    businessProblem: "Information needs structure before people can act.",
    delivery: "AI-assisted internal tools.",
    capabilityState: "available",
  },
  {
    id: "customer-systems",
    systemType: "CUSTOMER SYSTEMS",
    businessProblem: "Customer questions need useful routing and response paths.",
    delivery: "Customer-facing utilities and support systems.",
    capabilityState: "available",
  },
  {
    id: "lead-systems",
    systemType: "LEAD SYSTEMS",
    businessProblem: "Lead signals need capture, qualification, and human follow-up.",
    delivery: "Lead handling and routing systems.",
    capabilityState: "available",
  },
  {
    id: "operation-systems",
    systemType: "OPERATION SYSTEMS",
    businessProblem: "Operational information needs a practical shared view.",
    delivery: "CRM-lite and operational dashboard systems.",
    capabilityState: "available",
  },
  {
    id: "custom-mvps",
    systemType: "CUSTOM MVPs",
    businessProblem: "A specific problem needs a practical digital prototype.",
    delivery: "Custom MVPs and practical digital prototypes.",
    capabilityState: "available",
  },
] as const;
