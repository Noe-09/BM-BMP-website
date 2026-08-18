# BM Visuals — Project System

## Purpose

This document defines:

- which projects appear on the website
- homepage priority
- project type
- project metadata
- concept vs commercial labeling
- required project media

Portfolio philosophy:

SHOW THE WORK BM WANTS TO BE HIRED TO CREATE NEXT.

---

# PROJECT TIERS

## TIER A — FLAGSHIP

Projects that define BM's desired positioning.

Appear prominently on Homepage.

---

## TIER B — PORTFOLIO

Good commercial or category-specific work.

Appear on /work.

May occasionally appear on homepage depending on strategy.

---

## TIER C — LAB / ARCHIVE

Experiments, older demos and exploratory work.

Appear in BM Lab or remain internal.

---

# CURRENT PROJECT PRIORITY

## 01 — Fashion Project

Tier:

A — Flagship

Status:

In Development

Type:

Commercial or Concept — confirm before publishing

Industry:

Fashion

Role:

Primary visual flagship

Homepage:

YES

Priority:

01

Desired perception:

- fashion-forward
- editorial
- premium
- expressive
- highly art-directed

Services:

- Art Direction
- UI/UX
- Ecommerce
- Motion
- Creative Development

Required media:

- hero desktop
- hero mobile
- homepage preview
- collection view
- product view
- menu/navigation
- interaction recording
- mobile recording
- visual detail shots

---

# 02 — Aurelia Skin

Tier:

A — Flagship

Status:

Existing

Industry:

Beauty / Skincare

Homepage:

YES

Priority:

02

Role:

Demonstrate:

- beauty ecommerce
- product storytelling
- clean premium visual direction

Services:

- Digital Direction
- UI/UX
- Ecommerce
- Development

Required media:

- hero
- product page
- desktop homepage
- mobile
- interaction video
- detail screens

---

# 03 — Personal Branding

Tier:

A or B

Status:

Existing

Industry:

Personal Brand / Editorial

Homepage:

POSSIBLE YES

Priority:

03

Role:

Demonstrate:

- editorial design
- typography
- personal identity
- creative layout

Important:

Only publish the strongest final version.

Do not publish multiple nearly identical versions.

---

# 04 — Experimental Flagship

Tier:

A / Lab

Status:

To Be Defined

Type:

Self-Initiated

Homepage:

YES if quality is sufficient

Role:

Demonstrate:

- creative technology
- experimentation
- interaction
- creative development

Could be:

- WebGL experience
- generative typography
- interactive fashion concept
- 3D brand experiment

---

# 05 — Dental

Tier:

B

Industry:

Dental / Healthcare

Homepage:

NO by default

Work Page:

YES

Role:

Commercial credibility.

Demonstrate:

- service business website
- conversion
- clarity
- trust
- responsive design

---

# 06 — Coffee

Tier:

B / Lab

Current Internal Name:

coffee-demo

Public naming:

Must be converted into a proper project identity.

Do not display "coffee-demo" publicly.

Type:

Concept Project

Industry:

Hospitality / Coffee

Homepage:

NO by default

Lab:

Possible

Role:

Demonstrate:

- hospitality design
- atmosphere
- brand storytelling

---

# 07 — Spa

Tier:

B / Lab

Current Internal Name:

spa-demo

Public naming:

Must be converted into a proper project identity.

Type:

Concept Project

Industry:

Wellness

Homepage:

NO by default

Role:

Demonstrate:

- calm premium experience
- wellness art direction
- service storytelling

---

# 08 — Corporate / webxnk / web-cty

Tier:

B

Select only the strongest version.

Do not publish multiple similar projects only to increase portfolio count.

Role:

Demonstrate:

- corporate capability
- structured web design
- business communication

---

# HOMEPAGE INITIAL ORDER

Recommended:

01 Fashion

02 Aurelia Skin

03 Personal Branding / Editorial

04 Experimental Flagship

Maximum recommended:

4 major projects

---

# WORK PAGE

Possible order:

Fashion

Aurelia Skin

Personal Branding

Experimental

Dental

Coffee

Spa

Corporate

Order should be driven by quality,
not chronological date.

---

# PROJECT DATA MODEL

Recommended implementation:

```ts
type Project = {
  slug: string
  title: string
  year: number
  industry: string
  type: 'commercial' | 'concept' | 'self-initiated' | 'experimental'
  featured: boolean
  priority: number
  services: string[]
  shortDescription: string
  heroMedia: string
  thumbnailMedia: string
  liveUrl?: string
  status: 'draft' | 'published'
}
```

---

# PROJECT STATUS RULES

Use:

DRAFT

Project exists but should not appear publicly.

READY

Project has enough content and media to build a case study.

PUBLISHED

Project is allowed to appear publicly.

ARCHIVED

Project remains available internally but should not appear publicly.

---

# PROJECT PUBLISHING RULE

A project must not appear publicly simply because media exists.

Before publishing, verify:

- clear title
- project type
- correct concept/commercial status
- industry
- services
- short description
- sufficient visual media
- case study quality
- live URL if applicable

---

# PRODUCTION FILE STRUCTURE

Use:

```text
/public/projects/

fashion/
aurelia/
personal-branding/
experimental/
dental/
coffee/
spa/
corporate/
```

Preferred media naming:

```text
hero.webp
thumbnail.webp
desktop-01.webp
desktop-02.webp
mobile-01.webp
detail-01.webp
detail-02.webp
interaction.mp4
```

Not every project requires every file.

Only include media that strengthens the case study.

---

# FASHION PROJECT

Current state:

DRAFT until production media exists.

Do not block website development while Fashion is unfinished.

When ready:

featured:
true

priority:
1

status:
published

Until then, homepage may temporarily use the strongest available published project.

---

# AURELIA SKIN

Recommended:

Tier:
A

featured:
true

priority:
2

Status:

READY once project metadata and media are finalized.

Before publishing:

rename / optimize inconsistent files where necessary.

Preferred structure:

```text
hero.webp
thumbnail.webp
desktop-01.webp
desktop-02.webp
mobile-01.webp
detail-01.webp
detail-02.webp
interaction.mp4
```

---

# PERSONAL BRANDING

Select only one strongest version.

Rename generic screenshot filenames before production.

Do not keep production references such as:

```text
Screenshot 2026-08-03 192357.png
```

Preferred naming:

```text
hero.webp
thumbnail.webp
desktop-01.webp
desktop-02.webp
mobile-01.webp
detail-01.webp
```

Status:

READY after media cleanup.

---

# DENTAL

Tier:

B

featured:

false by default

Status:

READY

Purpose:

commercial credibility

Emphasize:

- trust
- clarity
- responsive design
- service-business conversion

---

# COFFEE

Tier:

B / Lab

Type:

Concept

Do not use:

coffee-demo

as public project title.

Create a proper project identity before publishing.

Possible role:

hospitality concept demonstrating atmosphere and storytelling.

---

# SPA

Tier:

B / Lab

Type:

Concept

Do not use:

spa-demo

as public-facing title.

Create proper project identity before publishing.

---

# CORPORATE

Select only:

webxnk

OR

web-cty

based on final visual quality.

Do not publish both unless they clearly demonstrate different capabilities.

---

# EXPERIMENTAL FLAGSHIP

Status:

DRAFT

Do not force an experimental project into V1.

Only publish if the quality strengthens BM.

Possible directions:

- creative coding
- generative typography
- WebGL
- interactive fashion concept
- visual system experiment

---

# CASE STUDY CONTENT MODEL

Recommended content structure:

```ts
type ProjectCaseStudy = {
  context?: string
  challenge?: string
  creativeDirection?: string
  experience?: string
  development?: string
  outcome?: string

  media?: {
    type: 'image' | 'video'
    src: string
    alt?: string
    caption?: string
  }[]
}
```

Do not over-engineer the content system for V1.

---

# CASE STUDY REQUIREMENTS

A strong flagship case study should include:

1. Project Hero
2. Project Metadata
3. Context
4. Creative Direction
5. Main Experience
6. Desktop Screens
7. Mobile Experience
8. Detail Moments
9. Motion / Interaction
10. Live Link if available
11. Next Project

---

# TRUTHFULNESS

Never fabricate:

- real clients
- campaign results
- conversions
- revenue
- engagement metrics
- testimonials
- awards

If a project is concept work, say so clearly.

Use:

Concept Project

Self-Initiated

Experimental

---

# HOMEPAGE FALLBACK RULE

Homepage should contain a maximum of four flagship projects.

Preferred future order:

1. Fashion
2. Aurelia Skin
3. Personal Branding
4. Experimental Flagship

If Fashion or Experimental are not ready:

Use the strongest currently available projects temporarily.

Do not publish weak work just to fill four slots.

---

# QUALITY PRINCIPLE

Three excellent projects are more valuable than ten average projects.

Archive anything that lowers BM Visuals' perceived quality.