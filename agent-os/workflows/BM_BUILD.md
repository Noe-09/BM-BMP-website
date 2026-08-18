# Workflow: BM Website Build

## Objective
Turn approved BM website specifications into a tested implementation with minimal rework.

## Required Inputs
- `docs/DESIGN_DIRECTION.md`
- `docs/SITE_ARCHITECTURE.md`
- `docs/CONTENT.md`
- `docs/PROJECTS.md`
- `docs/BUILD_PLAN.md`
- Relevant assets/references

## Flow
1. **Orchestrator** reads the spec and creates a task sequence with acceptance criteria.
2. **Brand Guardian** reviews the design/copy contract and flags conflicts before coding.
3. **Frontend Builder** implements one bounded task/section at a time.
4. **Evidence QA** validates the task with screenshots/tests where possible.
5. If FAIL, return exact defects to Frontend Builder; retest after fixes.
6. When all bounded tasks pass, run final route/responsive/integration QA.
7. Founder reviews material visual/positioning decisions before release.

## Quality Gate
Do not mark the site production-ready unless required routes, responsive layouts, primary interactions, content, and critical assets have been verified.

## State Record
For every task keep:
- task
- owner
- status: TODO / DOING / QA / BLOCKED / DONE
- spec reference
- evidence
- defects
- next owner

## Scope Rule
Ideas discovered during implementation go into a separate improvement list. They do not silently enter the current build scope.