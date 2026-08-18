Default reveal:
opacity 0 → 1
translateY 30 → 0
duration ~0.8–1.2s

Large heading:
masked line reveal

Project image:
scale 1.05 → 1
during viewport entry

Hover:
avoid generic scale buttons

Page transition:
project image should provide visual continuity where possible

Scrolling:
smooth but never sluggish

Motion rule:
every animation must communicate hierarchy,
continuity, discovery or feedback.
---

# Motion Hierarchy

Motion priority:

1. Page continuity
2. Project storytelling
3. Typography
4. Navigation feedback
5. Decorative motion

Decorative motion has the lowest priority.

---

# Easing

Prefer smooth, controlled easing.

Avoid:

- elastic
- bounce
- overly playful easing

Motion should feel confident rather than energetic.

---

# Scroll

Lenis may be used for smooth scrolling.

Requirements:

- do not make scroll heavy
- do not create excessive lag
- browser controls must remain predictable
- mobile may use simplified behavior if needed

---

# ScrollTrigger

GSAP ScrollTrigger may be used for:

- project reveals
- typography reveals
- controlled image scale
- section transitions
- limited pinned storytelling

Avoid excessive pinned sections.

---

# Text Reveal

Large headings:

Preferred:

- mask reveal
- line reveal
- controlled translate
- opacity where necessary

Do not apply the same reveal animation to every heading.

---

# Project Media

Project imagery may use:

- clip reveals
- scale 1.03–1.06 → 1
- subtle parallax
- mask transitions
- video playback

Avoid aggressive zoom effects.

---

# Hover

Desktop hover may communicate:

- View Project
- project category
- image response
- navigation direction

Do not use simple scale-up as the default hover for everything.

---

# Page Transition

Primary objective:

visual continuity.

Ideal experiment:

Selected Work media
→
Project Hero

Fallback:

controlled mask / fade transition.

Requirements:

- fast
- interruptible
- accessible
- browser-history safe

---

# Reduced Motion

Respect:

prefers-reduced-motion.

Reduce or disable:

- smooth scrolling
- parallax
- complex page transitions
- long reveals

Core content must remain fully usable.

---

# Performance

Never create continuous animation loops without strong reason.

Prefer transform and opacity.

Avoid layout-triggering animation where possible.

WebGL scenes should pause or simplify when not visible.

---

# Motion Success Test

Before approving an animation ask:

Does it improve:

- hierarchy?
- continuity?
- discovery?
- storytelling?
- feedback?

If no:

remove it.