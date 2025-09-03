# Test Strategy / Plan

## Scope
Covers GET /booking (filters, structure, perf), PATCH /booking/{id} (fields, nested, idempotency, errors), DELETE /booking/{id} (success, verification, concurrency, auth).

## Approach
- API-first automated checks via Jest + Axios
- Schema checks via Zod
- Data-driven cases via JSON in /data
- Performance smoke via repeated timings
- E2E flows for cross-endpoint consistency

## Environments
- Defaults to public demo. Variables allow switching to prod-like env without code changes.

## Risks & Mitigations
- **Public demo instability** → built-in retries, tolerant assertions for known variants (201 vs 204 etc.).
- **Rate limits** → small run counts, staggered requests.

## Reporting
- HTML report (jest-html-reporter) with console logs for timings.

Test Coverage Plan
A. GET /booking

Scenarios:

No filters (basic list retrieval)

Filter by: firstname, lastname, checkin, checkout

Combined filters

Invalid date format (expect 400)

Invalid parameter (e.g., unknown field)

Performance: Assert response.elapsed.total_seconds() < 2

Validate response schema (IDs list → use jsonschema if possible)

B. PATCH /booking/{id}

Scenarios:

Update single field (firstname)

Update multiple fields

Update nested fields (bookingdates)

Verify unchanged fields remain intact

Invalid booking ID (expect 404)

Invalid payload (wrong type, malformed JSON)

Missing auth → 401

Idempotency: Send same PATCH twice → no duplicate side effects

C. DELETE /booking/{id}

Scenarios:

Delete existing booking

Verify deletion (GET → 404)

Delete non-existing booking (graceful response)

Missing auth → 401

Correct status codes (201 for success – per spec, though normally 204 is expected)

Concurrent deletion: Send multiple DELETEs for same ID → only one should succeed

4. Advanced Testing Requirements

Data-Driven Tests:
Use pytest.mark.parametrize with JSON/CSV files (in /data) to feed different inputs for filters, patch payloads, and invalid data.

Negative Testing:

Malformed JSON

Special characters (e.g., '";DROP TABLE bookings;-- for SQL injection attempt)

Boundary values for totalprice (negative, extremely large)

Integration Test Flow:

Create → Update → Verify → Delete

Bulk create (loop) → filter them → patch them → delete all
