# BM Visuals Website — Project Instructions

## 1. Project Mission

Build a premium creative studio website for BM Visuals.

This website is not simply a marketing website.

The website itself must act as proof of BM Visuals' capability in:

- digital art direction
- UI/UX
- creative frontend development
- motion
- interactive experiences
- visual storytelling
- ecommerce presentation
- conversion-aware web design

The finished website should make visitors feel:

"This team clearly understands design, technology and brand experience."

## Current Build Scope

This repository may eventually support the broader BM / BMP brand ecosystem.

However, the CURRENT BUILD PHASE is strictly focused on:

BM VISUALS.

For this phase:

- Build BM Visuals only.
- Do not create BMP Technical pages.
- Do not add BMP Technical services to BM Visuals navigation.
- Do not introduce AI automation, operational software or technical consulting into BM Visuals homepage messaging.
- BMP Technical exists only as brand context unless explicitly requested later.

Current public website scope:

- /
- /work
- /work/[slug]
- /studio
- /contact
- /lab only if core pages are already strong

The priority is to make BM Visuals a premium creative digital studio website.

Do not expand scope without explicit approval.
---

## 2. BM Visuals Positioning

BM Visuals is the front-of-house creative digital studio.

Primary areas:

- brand websites
- ecommerce experiences
- landing pages
- UI/UX
- digital experiences
- visual systems
- creative frontend development
- motion and interaction
- conversion-facing digital experiences

BM Visuals focuses on what customers SEE, FEEL and INTERACT WITH.

---

## 3. BM Visuals vs BMP Technical

BMP Technical is a separate technical division.

BMP focuses on:

- automation
- AI systems
- operational software
- integrations
- internal business systems
- custom technical infrastructure

Do NOT turn the BM Visuals website into:

- an AI consultancy website
- an automation agency website
- a software development outsourcing website
- a generic technology company website

BM Visuals should remain strongly focused on:

BRAND + EXPERIENCE + DESIGN + DIGITAL CRAFT.

---

## 4. Target Audience

BM Visuals should be especially attractive to:

- fashion brands
- jewelry brands
- accessory brands
- beauty brands
- skincare brands
- hospitality brands
- lifestyle brands
- creative founders
- aesthetic-first businesses
- modern companies that care about digital perception

The website should still communicate enough commercial credibility to serve broader businesses when appropriate.

---

## 5. Desired Brand Perception

BM Visuals should feel:

- premium
- contemporary
- creative
- editorial
- intentional
- confident
- technically capable
- experimental without becoming chaotic
- small but highly focused
- culturally aware
- visually sophisticated

Core creative territory:

Editorial × Fashion × Creative Technology × Digital Craft

---

## 6. What BM Visuals Is NOT

Avoid making BM look like:

- a generic web agency
- a cheap freelancer portfolio
- a template studio
- a SaaS startup
- a corporate IT outsourcing company
- a trendy design clone
- an animation playground with no commercial purpose

---

## 7. Inspiration Policy

Lusion is a QUALITY BENCHMARK, not a template.

Study principles such as:

- immersive storytelling
- selected work as the center of the site
- strong typography
- cinematic pacing
- meaningful interaction
- creative transitions
- experimental technology
- the website itself demonstrating capability

Never directly reproduce:

- Lusion's exact layout
- proprietary visuals
- exact animation sequences
- exact typography combinations
- exact copy
- exact project presentation
- signature interaction patterns

BM Visuals must develop its own visual language.

---

## 8. Design Principles

Prioritize:

1. Typography
2. Composition
3. High-quality project media
4. Hierarchy
5. Motion
6. Interaction
7. Negative space
8. Art direction
9. Performance
10. Mobile quality

The experience should feel crafted rather than decorated.

---

## 9. Design Rules

Use:

- oversized editorial typography
- strong grids
- controlled asymmetry
- generous whitespace
- project-driven color
- monochrome foundations
- cinematic imagery
- restrained interface chrome
- purposeful motion
- unusual compositions where usability remains clear

Avoid:

- excessive gradients
- excessive glassmorphism
- glowing SaaS effects
- generic feature card grids
- random floating elements
- excessive rounded cards
- excessive pills
- fake dashboards
- generic startup illustrations
- overused AI visuals
- generic agency templates
- excessive decorative animation

---

## 10. Motion Principles

Motion must communicate one or more of:

- hierarchy
- continuity
- discovery
- navigation
- feedback
- storytelling

Never animate something only because animation is possible.

Motion personality:

"Slow confidence."

Prefer:

- mask reveals
- image reveals
- typography reveals
- scale transitions
- subtle parallax
- controlled scroll choreography
- media transitions
- shared visual continuity between pages
- subtle cursor interactions

Avoid:

- bouncing elements
- excessive rotation
- constant floating
- unnecessary particles
- random motion
- long animations that delay navigation

---

## 11. Engineering Stack

Preferred stack:

- Next.js
- TypeScript
- Tailwind CSS
- CSS where appropriate
- GSAP
- Lenis
- Three.js or React Three Fiber only when justified

Content initially:

- local typed data
- MDX if useful

Deployment:

- Vercel

Do not introduce a CMS unless there is a clear requirement.

---

## 12. Engineering Principles

Prioritize:

- maintainability
- performance
- responsive behavior
- accessibility
- reusable architecture
- clean component boundaries
- semantic HTML
- progressive enhancement

Avoid unnecessary dependencies.

Do not use WebGL where DOM/CSS can achieve the same result.

Target ratio:

- 70–80% DOM/CSS
- 15–20% motion
- 5–10% special WebGL/3D

This is a principle, not a strict mathematical requirement.

---

## 13. Responsive Rules

Mobile is a first-class experience.

Never treat mobile as a simplified afterthought.

For every major component verify:

- 1440px desktop
- laptop
- tablet
- ~390px mobile

Interactions that depend on hover must have touch alternatives.

Heavy WebGL effects should gracefully simplify when necessary.

---

## 14. Portfolio Philosophy

Portfolio is not a list of everything BM has built.

Portfolio should show the kind of work BM wants to be hired to create next.

Homepage should show only selected flagship projects.

Less important projects belong in All Work or BM Lab.

Concept projects are allowed.

Concept projects must be clearly labeled:

- Concept Project
- Self-Initiated
- Experimental

Never imply a fictional client relationship.

---

## 15. Truthfulness Rules

Never fabricate:

- clients
- testimonials
- awards
- metrics
- revenue numbers
- conversion improvements
- project results
- partnerships

If performance or outcome data is unavailable, focus on:

- creative direction
- problem framing
- design decisions
- experience design
- system design
- implementation quality

---

## 16. Reference Assets

The `/references` directory contains design research only.

Never ship reference screenshots in production.

Never directly use benchmark assets.

Never import Lusion assets into the website.

Production assets should come from:

- `/public`
- approved BM assets
- approved project assets

---

## 17. Content Source of Truth

Website copy must follow:

`docs/CONTENT.md`

Do not invent major marketing claims without approval.

Portfolio structure must follow:

`docs/PROJECTS.md`

Site structure must follow:

`docs/SITE_ARCHITECTURE.md`

Visual decisions must follow:

`docs/DESIGN_DIRECTION.md`

Implementation order must follow:

`docs/BUILD_PLAN.md`

---

## 18. Development Workflow

Before implementing a major phase:

1. Read this file.
2. Read relevant docs.
3. Inspect existing code.
4. Identify dependencies.
5. Identify conflicts.
6. Produce a short implementation plan.
7. Implement only the requested phase.
8. Run lint/build/tests.
9. Inspect responsive behavior.
10. Report changes and remaining issues.

Do not redesign unrelated sections during implementation.

---

## 19. Git Rules

Prefer small meaningful commits.

Example commit structure:

- chore: initialize website foundation
- feat: establish global design system
- feat: build homepage hero
- feat: implement selected work experience
- feat: add project case study system
- feat: build studio page
- feat: build contact experience
- perf: optimize project media
- fix: improve mobile interactions

Avoid massive commits containing unrelated changes.

---

## 20. Quality Bar

Do not stop when the website merely "works."

The target is:

- polished
- intentional
- memorable
- fast
- responsive
- visually distinctive
- production-ready

Whenever choosing between more effects and better craft, choose better craft.
## Decision Hierarchy

When project documents appear to conflict, follow this priority:

1. CLAUDE.md
2. docs/DESIGN_DIRECTION.md
3. docs/SITE_ARCHITECTURE.md
4. docs/CONTENT.md
5. docs/PROJECTS.md
6. docs/DESIGN_SYSTEM.md
7. docs/MOTION_SYSTEM.md
8. docs/BUILD_PLAN.md

If a contradiction can materially change the design, architecture or brand direction:

STOP.

Report the contradiction before implementing.

Do not silently choose one interpretation.
## Agent OS Scope

The `/agent-os` directory contains broader company operating agents and workflows.

For the current BM Visuals website build:

- Do not modify `/agent-os`.
- Do not use Sales, Finance, Market Intelligence or BMP workflows as website requirements.
- `agent-os/agents/frontend-builder.md` and `brand-guardian.md` may be consulted only if explicitly useful.
- Website source-of-truth remains CLAUDE.md and `/docs`.

Do not expand website scope based on `/agent-os`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
