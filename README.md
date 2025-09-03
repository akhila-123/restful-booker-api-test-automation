# Restful-Booker API Tests (Mocha + Axios)

## Prereqs
- Node.js 18+ (tested on Node 20)
- Internet access (public API)

## Setup
```bash
git clone <your-repo>
cd restful-booker-tests
cp .env.example .env
npm ci

# Restful Booker API - Automated Tests

## Setup
1. Copy `.env.example` -> `.env` and set values.
2. Install dependencies:
   npm ci

## Run tests
- Run simple tests:
  npm test

- Run with report:
  npm run test:report

## CI
- GitHub Actions workflow provided at .github/workflows/nodejs-api-tests.yml
- Set AUTH_USER and AUTH_PASS as repository secrets.

## Structure
- src/api: Api client and helpers
- src/tests: Mocha tests (unit/integration/e2e)
- test-data: External data files for data-driven tests
- reports/: mochawesome outputs

## Notes
- Tests are data-driven and idempotent where possible.
- Use unique names per booking to avoid collisions.


# Restful-Booker API Tests (Jest + Axios)

## Quick Start
```bash
cp .env.sample .env
npm i
npm test
# HTML report at reports/jest-report.html
```

## What’s Included
- Jest + Axios framework with retry logic and timing
- Token auth via `/auth` using Cookie header
- Data-driven tests (JSON)
- Negative tests (invalid types, SQLi-like strings)
- Performance checks (< 2s)
- E2E lifecycle test
- CI pipeline (GitHub Actions)

## Single Command Execution
`npm test` generates an HTML report at `reports/jest-report.html`.

## Environment Config
- `BASE_URL` (default: public demo)
- `AUTH_USERNAME`, `AUTH_PASSWORD`
- `HTTP_TIMEOUT_MS`, `RETRY_ATTEMPTS`

## LLM Usage
This scaffold and tests were generated with assistance from an LLM to accelerate boilerplate creation. Human review added domain assertions, retry/backoff, and schema validation with Zod.

## Submission Steps
1. Create a **private GitHub repo** and push this project.
2. Share access with reviewers.
3. Ensure CI is green on PR and `npm test` passes locally.