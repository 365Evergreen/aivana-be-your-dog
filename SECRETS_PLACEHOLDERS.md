# Repository Secrets (placeholders)

Add these repository secrets in GitHub Settings → Secrets and variables → Actions before running CI/CD.

Required for Azure Static Web Apps deployment
- `AZURE_STATIC_WEB_APPS_API_TOKEN` : <paste the deployment token from Azure Static Web Apps>

Recommended build-time environment variables (CRA reads `REACT_APP_` vars at build time)
- `REACT_APP_MSAL_CLIENT_ID` : <your-msal-client-id>
- `REACT_APP_MSAL_AUTHORITY` : <https://login.microsoftonline.com/{tenantId}>
- `REACT_APP_GRAPH_SCOPE` : <space-separated-scopes-if-needed>
- `REACT_APP_BOT_ID` : <bot id for Power Virtual Agents webchat>
- `REACT_APP_API_URL` : <backend API base URL>

Optional (GitHub Pages deploy or elevated actions)
- `GH_TOKEN` : <personal access token if you need cross-repo publish or elevated perms>

Power Apps Code App publishing (if automated)
- `POWERAPPS_CLIENT_ID`
- `POWERAPPS_CLIENT_SECRET`
- `POWERAPPS_TENANT_ID`

Notes
- Do NOT commit secrets to the repository. Use the GitHub repo secrets UI to add values.
- After adding `AZURE_STATIC_WEB_APPS_API_TOKEN`, the Azure SWA deploy workflow will be able to publish the `build/` artifact.
