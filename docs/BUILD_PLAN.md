
Note nhỏ: code fence TypeScript nằm bên trong Markdown nên khi paste file, bạn chỉ cần giữ nguyên cấu trúc.

---

# 6. `docs/BUILD_PLAN.md`

Đây là file cực quan trọng cho **ngày Claude unlimited**.

```md
# BM Visuals Website — Build Plan

## Objective

Build a production-quality creative studio website
without allowing scope expansion or uncontrolled experimentation.

Development must happen in phases.

Do not attempt to build the entire website in one pass.

---

# DEFINITION OF SUCCESS

Primary success criteria:

- premium visual quality
- strong BM identity
- responsive
- fast
- maintainable
- selected work feels impressive
- homepage itself demonstrates capability
- portfolio system is reusable
- project inquiry works

---

# PRIORITY LEVELS

## P0 — MUST SHIP

- technical foundation
- global design system
- homepage
- selected work
- work page
- project data system
- one complete flagship case study
- contact
- responsive implementation
- performance baseline

---

## P1 — SHOULD SHIP

- studio page
- additional case studies
- polished page transitions
- stronger motion system

---

## P2 — OPTIONAL

- BM Lab
- advanced WebGL
- custom shaders
- experimental cursor
- complex scene transitions
- advanced 3D

Never delay P0 because of P2.

---

# PHASE 00 — AUDIT

Before writing code:

Read:

- CLAUDE.md
- BM_CONTEXT.md
- CONTENT.md
- DESIGN_DIRECTION.md
- SITE_ARCHITECTURE.md
- PROJECTS.md
- DESIGN_SYSTEM.md
- MOTION_SYSTEM.md
- QA_CHECKLIST.md

Then inspect repository.

Output:

1. proposed architecture
2. dependency list
3. missing assets
4. contradictions
5. technical risks
6. implementation order

DO NOT CODE DURING THIS PHASE.

---

# PHASE 01 — TECHNICAL FOUNDATION

Initialize or verify:

- Next.js
- TypeScript
- Tailwind
- linting
- formatting
- environment
- Git state

Install only required dependencies.

Possible dependencies:

- gsap
- lenis
- clsx
- tailwind-merge

Do NOT install Three.js yet unless required.

Deliverables:

- app runs
- build passes
- basic root layout
- global CSS
- font strategy
- metadata baseline

Commit:

chore: initialize BM website foundation

---

# PHASE 02 — DESIGN FOUNDATION

Implement:

- typography tokens
- spacing
- container
- grid
- color variables
- breakpoints
- global interaction states
- reusable layout components

Possible components:

Container

Section

DisplayHeading

ProjectMeta

TextLink

Navigation

Footer

Do not over-componentize.

Deliverables:

A simple visual test page or homepage skeleton
demonstrating the design system.

Commit:

feat: establish BM design system

---

# PHASE 03 — HOMEPAGE STRUCTURE

Build complete homepage layout WITHOUT advanced animation.

Sections:

Navigation

Hero

Positioning

Selected Work

Philosophy

Capabilities

Lab Preview

Studio

Final CTA

Footer

Focus:

- hierarchy
- spacing
- typography
- project media
- responsive layout

Do not add complex WebGL.

Deliverables:

Homepage should already look strong
without animation.

Commit:

feat: build homepage foundation

---

# PHASE 04 — SELECTED WORK

Build flagship project presentation.

Initial projects:

1. Fashion
2. Aurelia
3. Personal Branding
4. Experimental

Avoid identical project cards.

Create visual variation while preserving system consistency.

Deliverables:

- desktop project presentation
- mobile project presentation
- project navigation links
- polished media behavior

Commit:

feat: implement selected work experience

---

# PHASE 05 — PROJECT SYSTEM

Create reusable typed project data.

Implement:

/work

/work/[slug]

Required:

- project metadata
- featured state
- project type
- services
- hero
- case-study sections
- next project

Initial complete case study:

Fashion OR Aurelia

Choose whichever has the strongest available media.

Deliverables:

- reusable architecture
- no duplicated project page structures
- project pages populated from data where appropriate

Commit:

feat: create reusable project case study system

---

# PHASE 06 — MOTION FOUNDATION

Only begin after layouts are stable.

Implement:

Lenis

GSAP

Motion principles from MOTION_SYSTEM.md.

Add:

- heading reveals
- media reveals
- subtle scroll effects
- project interaction
- navigation motion
- CTA feedback

Do not animate everything.

Deliverables:

Motion improves hierarchy and storytelling.

Commit:

feat: establish BM motion system

---

# PHASE 07 — PAGE TRANSITIONS

Explore visual continuity.

Possible:

project thumbnail
→ project hero

or

controlled fade/mask transition.

Requirements:

- navigation remains fast
- reduced-motion support
- no broken browser history
- no animation blocking navigation excessively

Commit:

feat: add project page transitions

---

# PHASE 08 — STUDIO

Build /studio.

Sections:

Intro

Philosophy

Capabilities

Process

Team

CTA

Keep visual quality consistent with homepage.

Commit:

feat: build studio page

---

# PHASE 09 — CONTACT

Build /contact.

Requirements:

- clear form
- validation
- accessible fields
- responsive
- success state
- error state

Avoid unnecessary form complexity.

Commit:

feat: build project inquiry experience

---

# PHASE 10 — BM LAB

Only begin if P0 is healthy.

Build /lab.

Start simple.

Possible V1:

experimental project index.

Advanced experiments may be added later.

Commit:

feat: establish BM Lab

---

# PHASE 11 — OPTIONAL WEBGL

Only if:

- homepage already looks excellent
- performance budget is healthy
- mobile is stable
- project system works

Potential WebGL usage:

Hero signature visual

or

BM Lab experiment

Do NOT rebuild the whole website around WebGL.

Commit separately.

Example:

feat: add interactive hero experiment

---

# PHASE 12 — RESPONSIVE QA

Inspect:

1440+

1280

1024

768

430

390

375

Check:

- typography
- overflow
- navigation
- project images
- spacing
- touch interaction
- video behavior
- forms

Fix mobile intentionally.

Do not simply reduce everything proportionally.

Commit:

fix: refine responsive experience

---

# PHASE 13 — PERFORMANCE

Audit:

- image sizes
- video sizes
- WebGL
- font loading
- JavaScript bundle
- animation cost
- unused dependencies
- layout shifts

Optimize:

- WebP / AVIF
- lazy loading
- preload only critical media
- dynamic loading if appropriate
- responsive images
- reduced-motion behavior

Commit:

perf: optimize media and runtime performance

---

# PHASE 14 — ACCESSIBILITY

Check:

- semantic hierarchy
- keyboard navigation
- focus states
- contrast
- alt text
- reduced-motion
- form labels
- link clarity

Commit:

fix: improve accessibility

---

# PHASE 15 — FINAL CREATIVE REVIEW

Review the website as a creative director.

Do not edit immediately.

First identify:

- generic sections
- weak composition
- repetitive layouts
- poor rhythm
- unnecessary animation
- weak project media
- inconsistent typography
- places that feel templated

Prioritize issues.

Then polish.

Commit:

style: final creative polish

---

# PHASE 16 — FINAL TECHNICAL REVIEW

Run:

lint

typecheck

build

Inspect console.

Check:

- broken links
- missing images
- missing metadata
- project URLs
- 404 behavior
- mobile
- forms

Commit:

fix: prepare production release

---

# WORKING LOOP

For every major phase:

PLAN
↓
IMPLEMENT
↓
RUN
↓
VISUAL INSPECTION
↓
REVIEW
↓
FIX
↓
COMMIT

Never allow several major unfinished phases
to accumulate simultaneously.

---

# CLAUDE SESSION STRATEGY

Main Agent:

architecture + implementation

Reviewer:

read-only creative / engineering review

Motion Reviewer:

animation and interaction review

Performance Reviewer:

performance only

Do not allow several agents to modify
the same global architecture simultaneously.

---

# DAY-ONE TARGET

Ideal unlimited-day outcome:

Homepage:
85–90%

Project system:
80%+

One flagship case study:
complete

Mobile:
good

Motion:
strong baseline

Work page:
functional

Contact:
functional

Studio:
if time permits

Lab / advanced WebGL:
optional

---

# STOP CONDITIONS

Stop adding features when:

- visual quality begins declining
- architecture becomes unnecessarily complex
- mobile is being ignored
- performance is degrading
- experimental work is blocking core pages

Return to refinement.

---

# FINAL RULE

A polished simple implementation
is better than an ambitious unfinished implementation.

Craft before complexity.