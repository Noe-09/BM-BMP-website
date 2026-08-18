# BM Visuals — QA Checklist

## Purpose

No major phase is considered complete until relevant QA checks pass.

The website must be reviewed technically AND visually.

---

# 1. Build Health

Before final approval:

- [ ] npm install succeeds
- [ ] development server starts
- [ ] lint passes
- [ ] TypeScript checks pass
- [ ] production build passes
- [ ] no major console errors
- [ ] no hydration errors
- [ ] no missing imports
- [ ] no broken routes

---

# 2. Required Routes

Verify:

- [ ] /
- [ ] /work
- [ ] /work/[slug]
- [ ] /studio
- [ ] /contact

Optional:

- [ ] /lab

---

# 3. Desktop Testing

Test approximately:

- [ ] 1920px
- [ ] 1440px
- [ ] 1280px
- [ ] 1024px

Check:

- [ ] no horizontal overflow
- [ ] typography remains intentional
- [ ] project media crops correctly
- [ ] navigation works
- [ ] hover states work
- [ ] spacing remains balanced
- [ ] project transitions work
- [ ] no overlapping content

---

# 4. Tablet Testing

Test:

- [ ] 1024px
- [ ] 768px

Check:

- [ ] grid adapts correctly
- [ ] typography does not break
- [ ] navigation remains usable
- [ ] media remains readable
- [ ] touch interactions work

---

# 5. Mobile Testing

Test:

- [ ] 430px
- [ ] 390px
- [ ] 375px

Check:

- [ ] no horizontal overflow
- [ ] headings have intentional line breaks
- [ ] text is readable
- [ ] navigation is usable
- [ ] buttons / links have sufficient touch area
- [ ] project media uses appropriate crops
- [ ] videos fit viewport
- [ ] motion is not excessive
- [ ] contact form is easy to use
- [ ] footer does not become cluttered

---

# 6. Navigation QA

- [ ] logo / BM link returns home
- [ ] Work works
- [ ] Studio works
- [ ] Lab works if enabled
- [ ] Contact / Start a Project works
- [ ] mobile menu opens
- [ ] mobile menu closes
- [ ] Escape closes overlays where appropriate
- [ ] browser back button behaves normally

---

# 7. Portfolio QA

For each published project:

- [ ] correct project title
- [ ] correct project type
- [ ] correct industry
- [ ] correct services
- [ ] correct year
- [ ] correct project label
- [ ] no fake client claims
- [ ] hero media loads
- [ ] desktop media loads
- [ ] mobile media loads
- [ ] walkthrough video loads if present
- [ ] live link works if present
- [ ] next project works

Concept projects must be clearly labeled.

---

# 8. Media QA

- [ ] no broken images
- [ ] no broken videos
- [ ] images use appropriate dimensions
- [ ] large PNGs are optimized where possible
- [ ] below-fold media is lazy loaded where appropriate
- [ ] videos are compressed
- [ ] autoplay videos are muted
- [ ] autoplay videos use playsInline
- [ ] walkthrough videos are not unnecessarily preloaded
- [ ] visual quality remains acceptable after compression

---

# 9. Motion QA

- [ ] Lenis does not make scrolling sluggish
- [ ] GSAP animations clean up correctly
- [ ] animations do not block navigation
- [ ] animations do not create layout shift
- [ ] hover effects do not break touch devices
- [ ] reduced-motion mode is supported
- [ ] no unnecessary continuous animations
- [ ] no major animation jank

Motion must improve:

- hierarchy
- continuity
- discovery
- navigation
- feedback
- storytelling

Otherwise remove it.

---

# 10. Accessibility QA

- [ ] semantic headings
- [ ] one logical H1 per page
- [ ] alt text where necessary
- [ ] decorative media handled correctly
- [ ] keyboard navigation works
- [ ] focus states visible
- [ ] labels attached to form fields
- [ ] links have understandable names
- [ ] acceptable contrast
- [ ] reduced-motion preference respected

---

# 11. Contact Form QA

- [ ] Name works
- [ ] Email validation works
- [ ] Company field works
- [ ] Project Type works
- [ ] Budget works if included
- [ ] Timeline works if included
- [ ] Description works
- [ ] submit state works
- [ ] loading state exists
- [ ] error state exists
- [ ] success state exists
- [ ] repeated submission is controlled

---

# 12. SEO Baseline

- [ ] page titles
- [ ] meta descriptions
- [ ] favicon
- [ ] Open Graph metadata
- [ ] canonical URLs where necessary
- [ ] semantic content
- [ ] sitemap if appropriate
- [ ] robots configuration

---

# 13. Performance

Review:

- [ ] initial JavaScript bundle
- [ ] image weight
- [ ] video weight
- [ ] font loading
- [ ] layout shift
- [ ] unnecessary client components
- [ ] unnecessary dependencies
- [ ] WebGL cost if used

Target:

The website should feel immediate despite rich media.

Do not trade core performance for decorative effects.

---

# 14. Creative QA

Ask:

- [ ] Does the homepage feel premium without animation?
- [ ] Does it avoid generic agency design?
- [ ] Is Selected Work visually dominant?
- [ ] Does each flagship project have its own character?
- [ ] Is there enough visual breathing room?
- [ ] Is typography doing meaningful visual work?
- [ ] Are there too many decorative elements?
- [ ] Does mobile still feel premium?
- [ ] Is anything obviously inspired too directly by Lusion?
- [ ] Does BM have its own visual identity?
- [ ] Does the site feel intentional rather than component-generated?

---

# 15. Brand QA

Check:

- [ ] BM Visuals is clearly the current website scope
- [ ] no BMP Technical service messaging appears accidentally
- [ ] no generic AI consultancy language appears
- [ ] no fake metrics
- [ ] no fake testimonials
- [ ] no fake clients
- [ ] no fake awards
- [ ] concept work is labeled truthfully
- [ ] copy follows CONTENT.md
- [ ] visual direction follows DESIGN_DIRECTION.md

---

# 16. Reference Safety

- [ ] no Lusion screenshots shipped to production
- [ ] no benchmark assets used directly
- [ ] no reference imagery used as BM project media
- [ ] benchmark ideas are interpreted, not copied
- [ ] BM maintains its own visual language

---

# 17. Final Production Gate

Before production deployment:

- [ ] lint passes
- [ ] typecheck passes
- [ ] build passes
- [ ] all P0 pages work
- [ ] desktop checked
- [ ] tablet checked
- [ ] mobile checked
- [ ] accessibility baseline checked
- [ ] media optimized
- [ ] console clean
- [ ] contact path verified
- [ ] no placeholder copy
- [ ] no fake project information
- [ ] no unused benchmark assets
- [ ] no reference assets shipped to production
- [ ] no BMP scope accidentally added
- [ ] walkthrough videos are production-safe
- [ ] final creative review completed

Only deploy after these checks.

---

# Final Rule

A technically working website is not enough.

BM Visuals must also feel:

- intentional
- premium
- distinctive
- responsive
- fast
- polished

If a feature harms clarity, performance or craft, simplify it.