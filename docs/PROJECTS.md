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