# BM Gateway Tunnel Prototype Implementation Plan

This initial plan has been superseded after self-review.

Use the canonical corrected plan:

`docs/superpowers/plans/2026-08-24-bm-gateway-tunnel-v2.md`

The V2 plan fixes three implementation ambiguities before coding begins:

- Task 1 now renders `GatewayFallback` until `GatewayPrototype` actually exists.
- Gateway navigation policy includes `event.detail`, preserving native keyboard activation.
- Coarse/mobile choreography has an explicit world-space camera path approximately 30–40% shorter than desktop, rather than only shortening interaction time.

Do not implement from this superseded file.
