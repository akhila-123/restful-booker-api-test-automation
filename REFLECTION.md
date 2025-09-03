# Reflection Questions

1) **Test Data Management in Production**
- Use ephemeral test data in non-prod environments; for prod-like data, anonymize via masking.
- Seed data via idempotent scripts or factories; tag records for cleanup.
- Use data versioning (JSON fixtures) and builders to avoid brittle hard-coding.
- For true prod, avoid creating data; leverage read-only synthetic datasets or contract tests.

2) **Test Environment Isolation**
- Dedicated test namespaces (DB schemas/tenants) per pipeline run.
- Unique identifiers per run; cleanup hooks to delete created data.
- Use containers and infrastructure-as-code to spin up clean envs.

3) **Retry Logic for Flaky Tests**
- App-level: Axios retry interceptor with exponential backoff on network/5xx.
- Test-level: `jest.retryTimes(n)` for known flaky specs.
- Add circuit breakers: fail fast on 4xx; collect diagnostics (request/response logs).

4) **API Quality Metrics**
- Availability (success rate), latency (p50/p95), error rates by endpoint.
- Contract compliance failures (schema violations), backward-compat incidents.
- Change failure rate after deploys; mean time to detect (MTTD).
- Security: auth failures, 401/403 trends; rate-limit hits.

Reflection Questions (answers)

1) Test Data Management in Production

Prefer non-prod for write tests; seed ephemeral data via idempotent factories and tag records for cleanup.

For prod-like realism, mask/anonymize sensitive data and use synthetic datasets.

Keep builders/fixtures versioned; avoid hard-coded IDs; provide automatic teardown on test completion.

In true prod, stick to read-only checks or contract tests; never leave test residue.

2) Test Environment Isolation

Use per-run namespaces/tenants or unique test prefixes; enforce cleanup hooks.

Spin environments with IaC (Docker/Compose or k8s) for repeatable, clean states.

Isolate auth tokens/roles per suite; gate external dependencies with mocks/stubs when validating edge cases.

3) Retry Logic for Flaky Tests

Transport-level retries: Axios interceptor with exponential backoff on network/5xx (already implemented).

Test-level retries: jest.retryTimes(n) for known flaky specs (wired in).

Fail-fast on 4xx; log request/response and timings; track flaky tests to quarantine or fix root causes.

4) API Quality Metrics Over Time

Reliability: success rate, 4xx/5xx by endpoint, error budgets.

Latency: p50/p95/p99 response times, timeout counts.

Correctness: schema/contract violations, backward-compatibility breaks.

Security: 401/403 trends, rate-limit hits, auth failures.

Delivery: change-failure rate post-deploy, MTTD/MTTR for incidents.