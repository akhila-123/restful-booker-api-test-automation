# Reflection Questions

1.	How would you handle test data management in a production environment?
A. I would handle test data management in a production environment by using anonymized or masked data to ensure sensitive information is not exposed. Where needed, I would create synthetic data specifically for testing purposes and ensure that it is deleted immediately after test execution to maintain data hygiene. Hard-coded IDs, names, or credentials would be avoided to ensure flexibility and prevent dependency on specific data. Additionally, wherever possible, I would perform read-only checks instead of creating or modifying live production data to minimize risks.

2.	What strategies would you implement for test environment isolation?
I would implement test environment isolation by separating environment-specific variables such as URLs, test data, and credentials from the test logic to ensure flexibility and maintainability. Environment-specific logic would be kept separate from the core tests, allowing smooth switching between environments (e.g., staging, QA, production-like). I would enforce cleanup hooks to ensure that any data created during the tests is deleted afterward, maintaining a clean state for subsequent runs. Additionally, authentication tokens would be isolated and fetched dynamically during test execution rather than being hard-coded. For external dependencies, I would use mocks and stubs to avoid reliance on third-party systems, ensuring that the tests remain stable and independent of external changes.

3.	How would you design retry logic for handling flaky tests?
I would design retry logic by utilizing built-in retry options available in tools like Axios and Mocha to automatically rerun tests when they fail due to transient issues. For API tests, I would implement a mechanism to retry requests until specific fields or expected results appear in the response, using a controlled wait-and-loop strategy while enforcing a fail-fast approach for 4xx errors to avoid unnecessary retries. I would also log request and response details along with execution timings for better debugging. Additionally, for UI tests, I would implement separate retry logic that focuses on dynamically locating elements, waiting for them to become visible or fully loaded before interacting. Furthermore, I would track flaky tests over time to either quarantine them or fix their root causes, ensuring they do not affect overall pipeline stability.

4.	What metrics would you track to measure API quality over time?
A. To measure API quality over time, I would track several key metrics.
For reliability, I would monitor the overall success rate, as well as the frequency of 4xx and 5xx errors by endpoint, and maintain error budgets to track acceptable failure thresholds.
For latency, I would capture response times at p50, p95, and p99 percentiles, along with timeout counts, to ensure performance remains within acceptable limits.
Correctness metrics would include schema or contract violations and any backward-compatibility breaks that could affect clients.
For security, I would track trends in 401/403 responses, rate-limit hits, and authentication failures.
