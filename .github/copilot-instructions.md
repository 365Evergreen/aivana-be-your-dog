# Copilot instructions for this repository

Purpose: Help an AI coding agent quickly become productive in this Create React App front-end that integrates MSAL/Graph and a Power Virtual Agents webchat bot.

- **Big picture**
  - App bootstrapped with Create React App; runtime starts with `npm start` and builds with `npm run build`.
  - Single-page React app with components in `src/components`, pages in `src/pages`, and shared UI in `src/components/common`.
  - Authentication is intended to use MSAL (`@azure/msal-browser`, `@azure/msal-react`) and Microsoft Graph (`@microsoft/microsoft-graph-client`), configured in `src/msalConfig.js`.
  - A conversational bot is embedded via an iframe in `src/components/FloatingCopilotBot.js` using a tenantId and botId to build the webchat URL.
  - Services live in `src/services` and currently contain simple stubs/mocks (`auth.js`, `api.js`). These are the obvious integration points for Graph and backend calls.

- **Key files to inspect/modify**
  - `src/msalConfig.js` — clientId, authority, redirectUri and `loginRequest` scopes (update for local dev vs GH Pages).
  - `src/components/FloatingCopilotBot.js` — tenantId, botId and `botUrl` construction (change bot or environment here).
  - `src/components/AIAssistant.js` — placeholder AI assistant component; used as extension point.
  - `src/services/auth.js` and `src/services/api.js` — current implementations are stubs; replace with MSAL and Graph logic here.
  - `package.json` — scripts: `start`, `build`, `test`, and `deploy` (deploy uses `gh-pages`). The `homepage` field points to GH Pages.

- **Developer workflows / commands**
  - Install dependencies: `npm install`
  - Dev server: `npm start` (CRA on localhost:3000 by default)
  - Run tests: `npm test`
  - Build: `npm run build`
  - Deploy to GH Pages: `npm run deploy` (runs `predeploy` -> `build`, then `gh-pages`)
  - Local MSAL testing: update `redirectUri` in `src/msalConfig.js` to `http://localhost:3000` and ensure the Azure AD app has that redirect URI registered.

- **Project-specific patterns & conventions**
  - UI components grouped under `src/components`; shared, small controls under `src/components/common` (e.g., `Button.js`, `Modal.js`). Follow existing component structure and props naming.
  - Pages live in `src/pages` and represent routed views (see `src/index.js` / routing setup).
  - Styles are colocated in `src/assets/styles` and imported by components (see `FloatingCopilotBot.css`).
  - Services under `src/services` act as the single place to swap mocks for real APIs.

- **Integration notes & gotchas**
  - MSAL: the repo includes MSAL packages but `src/services/auth.js` is a stub. Prefer implementing MSAL using `@azure/msal-react` patterns and pull scopes from `src/msalConfig.js`.
  - Bot iframe: `FloatingCopilotBot` uses a hard-coded GH Pages-compatible redirect and Power Virtual Agents webchat URL. If testing locally, ensure the bot webchat allows embedding from `localhost` origins or host on a publicly accessible URL.
  - Microsoft Graph: dependency present in `package.json` but no Graph logic. Implement Graph calls in `src/services/api.js` and keep token acquisition in `auth.js`.
  - Deployment: `homepage` in `package.json` is set to the GitHub Pages URL — keep in sync with the repo/organization if you change publishing target.

- **Concrete examples**
  - Change botId: edit `src/components/FloatingCopilotBot.js` and update `botId` and (if needed) `tenantId`.
  - Enable local auth testing: edit `src/msalConfig.js` `redirectUri` to `http://localhost:3000` and update the Azure AD app registration.
  - Replace auth stub: implement MSAL provider at app root and move token acquisition into `src/services/auth.js` for shared use.

- **When creating changes / PRs**
  - Keep component API consistent with existing `common` components (props names and style import patterns).
  - Do not `eject` CRA; keep changes compatible with `react-scripts`.
  - Update `src/msalConfig.js` only via environment-aware edits (local vs production); prefer keeping secrets out of source.

If anything above is unclear or you want me to add examples (e.g., a MSAL provider scaffold, Graph helper, or a local bot-hosting note), tell me which piece to expand.

Add MSAL and Graph integration scaffold. Add intgration with Dataverse and SharePoint Online as data sources.
