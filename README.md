# Restful-Booker API Tests (Mocha + Chai + Axios)

## Prereqs
- Node.js 18+ (tested on Node 20)
- Internet access (public API)

## Setup
1. Copy `.env.example` and create `.env` file and set values.
2. Install dependencies:
   npm i

## Run tests
- Run simple tests:
  npm test

- Run with report:
  npm run test:report

## CI
- GitHub Actions workflow provided at .github/workflows/nodejs-api-tests.yml
- Set AUTH_USER and AUTH_PASS as repository secrets.
- Implemented parallel execution 

## Structure
- utils: Api client and helpers
- tests: Mocha tests (unit/integration/e2e)
- test-data: External data files for data-driven tests
- reports/: mochawesome outputs

## Notes
- Tests are data-driven and idempotent where possible.
- Use unique names per booking to avoid collisions.

## What’s Included
- Mocha + Chai + Axios framework 
- Token auth via `/auth` using Cookie header
- Data-driven tests (JSON)
- Negative tests (invalid types, SQLi-like strings)
- Performance checks (< 2s)
- E2E lifecycle test
- CI pipeline (GitHub Actions)
