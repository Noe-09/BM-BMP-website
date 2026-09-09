import { approvedCopy } from "./types.ts";

const SOURCE = "canonical-docx:about-us";

export const ABOUT = {
  headline: approvedCopy(
    "We are building the kind of studio we would want to work with.",
    SOURCE,
  ),
  intro: approvedCopy(
    "BMP is a creative-tech studio focused on helping businesses present themselves better, operate smarter, and turn useful ideas into real digital experiences.",
    SOURCE,
  ),
  paragraphs: approvedCopy(
    [
      "BMP started from a simple belief: good ideas are not enough. They need to be understood, built well, and presented in a way that earns attention and trust.",
      "That is why our work sits at the intersection of creative direction, technology, and product building. Through BM Visual, we help brands improve how they look, communicate, and show up online. Through BM Tech, we build practical digital systems, automations, and tools around real business problems. Through BMP Creator, we develop our own apps and experiments — because building our own products keeps our thinking grounded in execution, not theory.",
      "We are intentionally lean. We do not try to imitate a large traditional agency. Instead, we focus on clear problems, focused scope, fast learning, and work that can be shown, tested, and improved.",
      "For us, design is not decoration, technology is not the goal, and content is not noise. Each should help a business become easier to understand, more credible to trust, and more useful to engage with.",
      "BMP is still evolving — and we prefer to show that evolution through the things we build.",
    ] as const,
    SOURCE,
  ),
  highlight: approvedCopy(
    "Design makes ideas understood. Technology makes them useful. Distribution makes them matter.",
    SOURCE,
  ),
  process: approvedCopy(
    [
      {
        title: "Understand",
        body: "Start with the problem, audience, context, and desired outcome.",
      },
      {
        title: "Define",
        body: "Choose the smallest clear scope that can create meaningful value.",
      },
      {
        title: "Build",
        body: "Design, prototype, implement, or produce the system/content required.",
      },
      {
        title: "Review",
        body: "Test the output against the original problem, not just subjective taste.",
      },
      {
        title: "Improve",
        body: "Use feedback and real-world signals to iterate.",
      },
    ] as const,
    SOURCE,
  ),
  team: approvedCopy(
    "BMP is a lean studio built around hands-on execution. We keep the team structure focused and bring the work back to the people actually designing, building, testing, and shipping it.",
    SOURCE,
  ),
} as const;
