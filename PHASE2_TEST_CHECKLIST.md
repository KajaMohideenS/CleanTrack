# CleanTrack Phase 2 Manual Verification Checklist

Run from the project directory after `npm ci`:

```bash
npm run build
npm run dev
```

## Shop workflow
- [ ] Create an order with valid customer, contact, garment, and service details.
- [ ] Confirm a duplicate custom order ID is rejected (case-insensitively).
- [ ] Confirm malformed custom IDs (spaces/symbols or outside 3–20 characters) are rejected.
- [ ] Search by order ID, customer name, contact, and garment.
- [ ] Filter by each supported service type.
- [ ] Export orders and confirm the downloaded CSV opens with the expected columns.
- [ ] Advance an order through Received, Cleaning, Quality Check, Ready for Pickup, and Collected.
- [ ] Confirm the estimated ready time is hidden at Ready for Pickup and Collected.

## Persistence and recovery
- [ ] Refresh the page and confirm valid orders remain.
- [ ] Open the app in a second tab, update an order, and confirm the other tab refreshes its order list.
- [ ] In browser developer tools, replace the `cleantrack_orders_v1` value with malformed JSON; reload and confirm demo data is restored.
- [ ] Replace storage with an array containing one valid and one malformed order; reload and confirm the valid order is retained.
- [ ] If testing in a browser that blocks storage, confirm the app reports a clear save failure rather than silently claiming success.

## Estimator
- [ ] Compare estimates for Ironing and Dry Cleaning; Dry Cleaning should have a longer base estimate.
- [ ] Compare a shirt and a suit; the suit should include a larger complexity adjustment.
- [ ] Add an order in Quality Check and confirm it contributes to the active queue count for a newly created order's estimate.

Record actual results and screenshots before using this checklist as assessment evidence. Do not mark a test complete unless it has been run.
