# CleanTrack – Phase 2 Change Log

This change log describes changes made to the uploaded source snapshot.

## Added in this update

1. Shop order search across order ID, customer name, contact number, and garment description.
2. Service-type filter for the shop order list.
3. CSV export of all saved orders, including customer, service, status, creation time, and estimate fields.
4. Order input validation for required customer name, contact, and garment values at the repository boundary.
5. Duplicate manually entered order ID detection.
6. Collision checking for generated order IDs.
7. LocalStorage record-shape validation and recovery of valid records when some stored entries are malformed.
8. Explicit error handling when browser storage cannot save the order collection.
9. Form-level handling and display of order creation errors.
10. README documentation of new functionality and prototype limitations.

## Existing functionality retained

- Customer order lookup and tracking.
- Shop dashboard and order metrics.
- Five-stage order lifecycle.
- LocalStorage persistence and cross-tab storage event synchronization.
- Heuristic ready-time estimation with customer-facing explanation.
- Demo order reset.

## Verification status

A production build was attempted with `npm run build`. The local `node_modules` directory in the supplied workspace contains incomplete type packages, causing TypeScript errors such as missing `@types/react` and Babel/ESTree type definitions before application compilation. A clean `npm ci --no-audit --no-fund` was attempted but timed out in this environment. Therefore, a successful production build is **not yet verified**. Run `npm ci` and `npm run build` in a normal network-enabled development environment before pushing or submitting.
