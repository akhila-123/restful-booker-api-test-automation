# Test Strategy / Plan

## Scope
Covers GET /booking (filters, structure, performance), PATCH /booking/{id} (fields, nested, idempotency, errors), DELETE /booking/{id} (success, verification, concurrency, auth).

## Approach
- API-first automated checks via Mocha + Chai + Axios
- Data-driven cases via JSON in /testData
- Performance smoke via repeated timings
- E2E flows for cross-endpoint consistency

## Environments
- Defaults to public demo. Variables allow switching to prod-like env without code changes.

## Risks & Mitigations
- **Public demo instability** → built-in retries, tolerant assertions for known variants (201 vs 204 etc.).
- **Rate limits** → small run counts, staggered requests.

## Reporting
- HTML report (jest-html-reporter) with console logs for timings.

 ## Test Coverage Plan
A. GET /booking – Get Booking IDs

1. Retrieve all booking IDs without filters (basic list retrieval)
2. Filter by: firstname, lastname, checkin, checkout
3. Combine multiple filters
4. Invalid date format (expect 400)
5. Invalid parameter (e.g., unknown field)
6. Validate response schema (IDs list → use jsonschema if possible)
7. Invalid request payload API should return 400
8. Verify SQL injection attempts

B. PATCH /booking/{id}

1. Update single field (firstname)
2. Update multiple fields
3. Update nested fields (bookingdates)
4. Verify unchanged fields remain intact
5. Invalid booking ID (expect 404)
6. Invalid payload (wrong type, malformed JSON)
7. Missing authentication → 401
8. Idempotency: Send same PATCH twice → no duplicate side effects

C. DELETE /booking/{id}

1. Delete existing booking
2. Verify deletion (GET → 404)
3.  Delete non-existing booking (graceful response)
4. Missing authentication → 401
5. Correct status codes (201 for success – per spec, though normally 204 is expected)
6. Concurrent deletion: Send multiple DELETEs for same ID → only one should succeed

D. INTEGRATION TESTS (e2e)

1. Create → Update → Verify → Delete flow
2. Bulk create (loop) → Filter them → Patch them → Delete all flow
3. Verify cross-endpoint data consistency verification

E. PERFORMANCE TEST

1. Verify the performance when retriving all booking IDs without filters and be fast (<2s)

## Advanced Testing Requirements

Data-Driven Testing
Negative Testing
Integration Testing


