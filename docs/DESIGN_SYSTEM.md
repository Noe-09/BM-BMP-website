# BM Visuals — Design System

## Status

Design System V0.

This document defines the structural design rules for the first implementation.

Claude may propose refinements during Phase 02, but must preserve the principles defined here.

Do not introduce major design-system changes without explaining why.

---

# 1. Design Philosophy

The system should support:

- editorial layouts
- oversized typography
- strong project imagery
- controlled asymmetry
- cinematic pacing
- responsive composition
- premium simplicity

The design system should create consistency without making every section look identical.

BM Visuals should feel designed, not component-generated.

---

# 2. Color Foundation

Primary foundation:

Background:
#0A0A0A

Foreground:
#F2F0EB

Muted Text:
rgba(242, 240, 235, 0.60)

Subtle Text:
rgba(242, 240, 235, 0.40)

Border:
rgba(242, 240, 235, 0.16)

Strong Border:
rgba(242, 240, 235, 0.30)

Light Surface:
#F2F0EB

Dark Text:
#111111

Project colors:

Projects may temporarily introduce their own visual palette.

Project-specific color must never destroy global readability or navigation consistency.

Avoid permanent rainbow gradients.

---

# 3. Typography Strategy

Typography is a primary visual tool.

Use a maximum of:

- one primary display / grotesk family
- one body family

Optional:

- one serif accent used rarely

Do not mix many typefaces.

If custom fonts are not available during initial implementation, use strong system or open-source substitutes and keep the architecture easy to replace later.

---

# 4. Type Scale

Use fluid typography with clamp().

Suggested starting points:

Display XL:

clamp(4rem, 10vw, 10rem)

Display L:

clamp(3.25rem, 7.5vw, 7.5rem)

Display M:

clamp(2.5rem, 5vw, 5rem)

Heading:

clamp(2rem, 3.5vw, 3.5rem)

Body Large:

clamp(1.15rem, 1.5vw, 1.5rem)

Body:

1rem

Small:

0.8rem – 0.9rem

Metadata:

0.7rem – 0.85rem

These are starting values.

Adjust during visual review.

---

# 5. Line Height

Display:

0.88 – 1.00

Large Heading:

0.95 – 1.1

Body Large:

1.35 – 1.5

Body:

1.45 – 1.65

Metadata:

1.2 – 1.4

Large typography should feel intentionally compressed.

Body typography must remain readable.

---

# 6. Letter Spacing

Display typography:

slightly negative where appropriate.

Body:

neutral.

Metadata / uppercase labels:

slightly positive.

Do not overuse tracking effects.

---

# 7. Grid System

Desktop:

12 columns

Tablet:

8 columns

Mobile:

4 columns

Grid should be consistent across pages.

Controlled asymmetry is encouraged.

Do not center everything.

---

# 8. Container

Desktop max width:

approximately 1600px

Standard horizontal padding:

Desktop:
32–48px

Tablet:
24–32px

Mobile:
16–20px

Full-bleed project media may intentionally escape the container.

---

# 9. Section Spacing

Sections should have generous vertical rhythm.

Suggested baseline:

Large section:

clamp(7rem, 12vw, 14rem)

Medium section:

clamp(5rem, 8vw, 10rem)

Small section:

clamp(3rem, 5vw, 6rem)

Do not use the same spacing everywhere.

The homepage should alternate between compressed and expansive moments.

---

# 10. Layout Rhythm

Use:

BIG / IMMERSIVE

followed by:

QUIET / INFORMATIONAL

Then return to:

BIG / VISUAL

Avoid long sequences of equally sized sections.

---

# 11. Navigation

Navigation should be visually restrained.

Desktop:

BM Visuals

Work
Studio
Lab
Start a Project

Possible behavior:

- transparent over hero
- subtle change after scrolling
- simple menu animation
- no large SaaS-style navbar

Mobile:

compact navigation

A menu overlay is acceptable.

Navigation must remain fast and understandable.

---

# 12. Links

Prefer text links:

View Project ↗

Start a Project ↗

Explore Work →

Underline, line movement or arrow movement may be used for feedback.

Avoid generic large rounded CTA buttons unless required by composition.

---

# 13. Borders

Borders should be subtle.

Use primarily for:

- metadata
- project separators
- navigation
- information hierarchy

Avoid excessive card borders.

---

# 14. Border Radius

Use sparingly.

Default:

0px – 8px

Project visuals may use no radius at all.

Avoid large SaaS-style rounded cards.

---

# 15. Project Media

Project media is one of the strongest visual elements.

Prefer:

- full-width media
- large editorial crops
- video
- interface details
- controlled framing

Do not show important project work as tiny thumbnails.

---

# 16. Project Metadata

Recommended format:

01

PROJECT NAME

Fashion / Ecommerce

2026

Metadata should be visually quiet compared to project media.

---

# 17. Responsive Breakpoints

Suggested implementation:

Mobile:
< 640px

Tablet:
640px – 1023px

Desktop:
1024px+

Large Desktop:
1440px+

Do not rely only on breakpoints.

Use fluid sizing where possible.

---

# 18. Mobile Principles

Mobile should feel intentionally designed.

Do not simply stack desktop components.

Consider:

- different image crops
- different typography line breaks
- simplified interaction
- reduced motion
- shorter transitions
- touch-safe controls

---

# 19. Image Treatment

Use Next.js Image when appropriate.

Production assets should preferably use:

- WebP
- AVIF when beneficial

Avoid large unoptimized PNG files.

Project imagery may use:

object-fit: cover

but crops must be intentional.

---

# 20. Video Treatment

Portfolio interaction videos should generally be:

- muted
- autoplay
- loop
- playsInline

Use poster images when appropriate.

Do not autoplay heavy videos below the fold unnecessarily.

Lazy-load non-critical media.

---

# 21. Z-Index Strategy

Keep z-index simple.

Suggested layers:

Base content:
0

Media / decoration:
10

Navigation:
50

Menu overlay:
100

Page transition:
200

Cursor / controlled overlay:
300

Do not create arbitrary z-index values across components.

---

# 22. Interaction Feedback

Interactive elements must provide visible feedback.

Possible:

- underline movement
- text shift
- arrow shift
- media reveal
- cursor state
- subtle opacity change

Avoid generic scale-up hover on every component.

---

# 23. Accessibility

Maintain:

- sufficient contrast
- visible keyboard focus
- semantic heading order
- readable text
- touch targets
- reduced-motion support

Creative direction must not remove basic usability.

---

# 24. Design Success Test

Before approving a component ask:

1. Is it visually intentional?
2. Is it necessary?
3. Does it feel like BM?
4. Does it resemble generic agency UI?
5. Is the project media strong enough?
6. Does it remain strong on mobile?
7. Could motion improve it?
8. Could removing something improve it?

Prefer reduction over decoration.