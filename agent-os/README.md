# BM/BMP Agent Operating System

This folder defines the first operational AI workforce for BM Visuals and BMP Technical.

## Principle
Agents do not operate from generic prompts. Every agent must read shared company context, respect founder authority, use evidence, and hand work off through explicit workflows.

## V1 Core Team
1. Orchestrator — routes work and enforces handoffs.
2. Market Intelligence — researches markets, ICPs, competitors, signals, and opportunities.
3. Outbound Strategist — turns qualified signals into personalized outreach and pipeline.
4. Brand Guardian — protects positioning, narrative, visual direction, and consistency.
5. Frontend Builder — implements BM/BMP web experiences from approved specs.
6. Evidence QA — validates outputs with evidence before work is considered done.

## Shared Context
- `company-context/BM.md`
- `company-context/BMP.md`
- `company-context/FOUNDER.md`
- `company-context/OPERATING_RULES.md`

## Workflows
- `workflows/BM_BUILD.md`
- `workflows/BM_SALES.md`
- `workflows/BMP_PRODUCT.md`
- `workflows/WEEKLY_REVIEW.md`

## Execution Contract
Before doing meaningful work, an agent must:
1. Read the relevant company context.
2. State which objective it is serving.
3. Distinguish fact, evidence/signal, inference, assumption, and unknown.
4. Avoid changing scope without approval.
5. Produce a deliverable that another agent or human can use.
6. Pass the result to QA or the next named owner when the workflow requires it.

## Recommended Use
Use the Orchestrator as the default entry point. Call specialists only for work matching their charter. Add more agents only after a repeated bottleneck appears in real work.