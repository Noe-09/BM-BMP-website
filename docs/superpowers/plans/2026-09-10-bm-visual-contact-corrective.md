# BM Visual + Contact Corrective Pass

## Scope

- Preserve every canonical BM Visual capability label while restoring indexed-list rhythm at desktop, tablet, and mobile widths.
- Replace breakpoint-specific link removal with an intentional compact navigation that exposes every canonical destination.
- Turn Contact into a validated inquiry form with a server-side, provider-neutral delivery boundary.
- Record operational success/error messages as proposed copy.
- Keep Gateway byte-for-byte unchanged.

## Delivery boundary

No verified provider or inquiry destination exists in the repository or current environment. The server boundary will therefore require one secret configuration value: `BMP_INQUIRY_WEBHOOK_URL`. The form remains truthful when that value is absent and must not claim delivery.

## Verification

1. Add failing tests for capability sizing tiers, compact navigation, field semantics, validation, and provider configuration.
2. Implement the smallest passing UI and Server Action boundary.
3. Review every capability in default/active states across desktop, tablet, and mobile.
4. Review Contact initial, focus, typing, validation, optional fields, enabled submit, and unavailable-delivery error states across all three widths.
5. Run full tests, typecheck, lint, production build, and exact Gateway zero-diff audit.
6. Push to the existing PR without merging and verify the refreshed Vercel Preview deployment.
