# PR: feature/msal-graph-dataverse

This branch adds MSAL + Microsoft Graph scaffolding, Dataverse and SharePoint service helpers, lazy-loading for heavy pages, a simple `ConfigCard` component for app settings, an `Expenses` page that integrates the dynamic SharePoint form, and unit tests for the new services.

## Summary of changes
- `src/services/dataverse.js` — Dataverse CRUD helpers using `acquireToken`.
- `src/services/graph.js` — Graph client helpers that acquire tokens and convenience fetch helpers.
- `src/services/msalInstance.js` — resilient MSAL instance with a test-friendly stub.
- `src/components/ConfigCard.js` — simple settings UI persisted to `localStorage`.
- `src/pages/ExpensesPage.js` — Expenses page skeleton wired to `DynamicSharePointForm`.
- Tests added for `dataverse` and `sharepoint` services; updated `App.test.js` to handle lazy-loading.

## How to run
- Dev server: `pnpm start`
- Tests: `pnpm test --watchAll=false`
- Build: `pnpm build`
