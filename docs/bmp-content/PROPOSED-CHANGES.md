# BMP Proposed Changes Awaiting Human Approval

## Proposal 1 Public route slugs

**PROPOSAL:** Use concise, stable English slugs for the canonical sitemap.

**CURRENT DOCUMENT DIRECTION:** The document names BM Visual, BM Tech, BMP Creator, About Us, and Contact but does not define URLs.

**PROPOSED CHANGE:** Use `/bm-visual`, `/bm-tech`, `/creator`, `/about`, and `/contact`.

**WHY:** Explicit slugs are required for routing and navigation.

**BENEFIT:** Clear URLs that match the public architecture and avoid nesting the divisions under an invented hierarchy.

**RISK:** The founder may prefer `/visual`, `/tech`, `/bmp-creator`, or another naming convention.

**CONTENT IMPACT:** None; public labels remain canonical.

**IMPLEMENTATION IMPACT:** Determines App Router directories, navigation links, sitemap entries, and future redirects.

**RECOMMENDATION:** Approve the proposed slugs before Phase 1.

**STATUS:** APPROVED

## Proposal 2 Existing concept projects in Work

**PROPOSAL:** Reuse the current concept-project registry only after record-by-record verification.

**CURRENT DOCUMENT DIRECTION:** Work is the proof hub, but the DOCX provides no named project records. The repository contains Fabriclism, Aurelia Skin, Haven, and Æther records labeled as concepts, plus additional media folders.

**PROPOSED CHANGE:** Treat the four existing concept records as candidate `Web & Digital Experience` and/or `Experiments` entries. Preserve an explicit concept label, remove unsupported outcome language, and publish only fields verified by the founder.

**WHY:** The existing work and media may provide real proof, but repository presence alone is not canonical approval.

**BENEFIT:** Preserves high-quality existing case-study architecture and avoids an empty Work hub if the records are confirmed.

**RISK:** Incorrect classification or unverified copy could imply clients, results, or ownership not supported by the canonical source.

**CONTENT IMPACT:** Adds verified project-specific structured data outside the DOCX while leaving brand positioning unchanged.

**IMPLEMENTATION IMPACT:** Adapts `lib/projects/selected-work.ts`, `lib/projects/project-cases.ts`, and the reusable case components into the new typed Work model.

**RECOMMENDATION:** Approve the reuse direction, then provide or verify each record before it appears publicly.

**STATUS:** APPROVED CONDITIONALLY — every published record requires a verified `ProjectStatus`; concept, demo, experiment, and owned-product work must be honestly labeled; `Client Work` must never be inferred.

## Proposal 3 Contact submission behavior

**PROPOSAL:** Build the canonical form UI separately from its delivery adapter.

**CURRENT DOCUMENT DIRECTION:** The document supplies fields and CTA labels but no destination, backend, privacy wording, or response messages. It explicitly avoids a heavy CRM workflow.

**PROPOSED CHANGE:** Implement an accessible form component and typed submission interface, but do not connect or claim successful delivery until the destination and messages are approved. Keep existing direct contact channels available as verified alternatives during the gap.

**WHY:** The visual form and content can be implemented without inventing operational configuration.

**BENEFIT:** Maintains technical clarity and makes a later email, webhook, or Server Action connection small and isolated.

**RISK:** A submit control cannot be production-active until the missing destination and response behavior are resolved.

**CONTENT IMPACT:** Adds no new claim; existing direct-contact labels remain separate from canonical form copy.

**IMPLEMENTATION IMPACT:** Introduces a focused form component and later one submission adapter instead of a CRM system.

**RECOMMENDATION:** Approve the boundary and choose a submission destination before the Contact page is declared launch-ready.

**STATUS:** APPROVED

## Proposal 4 Shared master-brand shell

**PROPOSAL:** Replace repeated page-level BM Visual navigation with a shared BMP site header and footer.

**CURRENT DOCUMENT DIRECTION:** BMP is the master brand and the Home page routes visitors to Work, BM Visual, BM Tech, BMP Creator, About Us, and Contact.

**PROPOSED CHANGE:** Create shared `SiteHeader` and `SiteFooter` components driven by `content/navigation.ts`. Keep page content as Server Components and isolate interactive behavior in focused Client Components.

**WHY:** The current navigation is duplicated and carries the old BM Visual-only architecture.

**BENEFIT:** Prevents naming drift, reduces copy duplication, improves maintainability, and keeps mobile/keyboard behavior consistent.

**RISK:** Shared navigation changes affect every public canonical page and require thorough responsive testing.

**CONTENT IMPACT:** Uses only canonical labels; no copy change.

**IMPLEMENTATION IMPACT:** Modifies the public shell and route composition while leaving Gateway components independent.

**RECOMMENDATION:** Approve as the implementation architecture.

**STATUS:** APPROVED

## Proposal 5 Gateway naming and entry integration

**PROPOSAL:** Defer all Gateway label and entry-flow changes to a separate approved task.

**CURRENT DOCUMENT DIRECTION:** New website content uses BM Visual and BM Tech. The approved Gateway may display BM VISUALS and BMP TECHNICAL and should act as an independent entry layer.

**PROPOSED CHANGE:** Make no Gateway change in this content branch. After the canonical pages are complete, review labels, destinations, first-visit behavior, and return navigation as a separate integration proposal.

**WHY:** Resolving the naming mismatch or moving the entry layer would alter an approved independent experience.

**BENEFIT:** Eliminates regression risk and preserves a clean approval boundary.

**RISK:** The temporary display-label mismatch remains visible wherever the Gateway is accessed.

**CONTENT IMPACT:** None in this phase.

**IMPLEMENTATION IMPACT:** Gateway code, shaders, scene, state, navigation, progress, and tests remain untouched.

**RECOMMENDATION:** Approve deferral; do not bundle Gateway integration with canonical content implementation.

**STATUS:** APPROVED

## Proposal 6 Repository guidance alignment

**PROPOSAL:** Update the repository guidance after the canonical architecture is approved.

**CURRENT DOCUMENT DIRECTION:** `CLAUDE.md` defines the current build as BM Visual-only and explicitly prohibits BM Tech pages. The new user-approved integration brief expands the production sitemap to BMP, BM Visual, BM Tech, BMP Creator, About, Work, and Contact.

**PROPOSED CHANGE:** Replace only the obsolete public-site scope and naming sections in `CLAUDE.md` with the approved canonical architecture while retaining applicable craft, accessibility, performance, and Gateway safety rules.

**WHY:** The direct integration request governs this task, but contradictory persistent guidance would misdirect future maintainers and agents.

**BENEFIT:** Keeps repository instructions aligned with the actual approved product architecture and prevents later naming or scope regression.

**RISK:** An overly broad edit could remove useful BM Visual design constraints or imply that Gateway integration is approved.

**CONTENT IMPACT:** No public copy change.

**IMPLEMENTATION IMPACT:** One narrow repository-documentation update, reviewed separately from production page changes.

**RECOMMENDATION:** Approve a minimal scope update during Phase 0 and preserve all compatible engineering and design guidance.

**STATUS:** APPROVED

## Proposal 7 Capability presentation

**PROPOSAL:** Present BM Visual, BM Tech, and BMP Creator as three destination surfaces or worlds within the shared BMP identity instead of generic service cards.

**CURRENT DOCUMENT DIRECTION:** The canonical Home architecture defines three capability blocks with exact approved copy.

**PROPOSED CHANGE:** Preserve that copy while giving BM Visual a more expressive and atmospheric surface, BM Tech a more structural and precise surface, and BMP Creator a more experimental and product-oriented surface.

**WHY:** The blocks define information architecture and destinations, not a mandatory card-grid visual pattern.

**BENEFIT:** Makes each division memorable while preserving one coherent BMP master brand.

**RISK:** Excessive visual differentiation could fragment the identity or obscure the copy.

**CONTENT IMPACT:** None; all canonical copy remains exact.

**IMPLEMENTATION IMPACT:** Requires one responsive capability-destination composition with controlled per-surface visual behavior rather than a generic reusable card grid.

**RECOMMENDATION:** Implement the three surfaces with shared typography, spacing, and navigation rules, then vary only atmosphere, structure, and interaction.

**STATUS:** APPROVED

## Proposal 8 Home clarity

**PROPOSAL:** Make immediate positioning clarity the non-negotiable first-view constraint.

**CURRENT DOCUMENT DIRECTION:** Home must position BMP within approximately 5–10 seconds and includes a canonical eyebrow, headline, supporting copy, and two CTAs.

**PROPOSED CHANGE:** Render all five elements immediately in semantic HTML without depending on loaders, motion, 3D, canvas readiness, or an experimental reveal.

**WHY:** The visual system is valuable only after visitors understand what BMP is and what to do next.

**BENEFIT:** Improves comprehension, accessibility, resilience, and conversion while preserving room for later experimentation.

**RISK:** The first frame can feel too conventional if composition and typography are not sufficiently authored.

**CONTENT IMPACT:** None; the exact canonical copy is foregrounded.

**IMPLEMENTATION IMPACT:** Home motion and enhancement layers must be progressive and non-blocking, with complete reduced-motion and no-WebGL fallbacks.

**RECOMMENDATION:** Treat the semantic hero as the permanent base layer and add experimental behavior only after its readability is secured.

**STATUS:** APPROVED
