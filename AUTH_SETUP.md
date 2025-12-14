# Authentication setup for GitHub Pages deployment

This app uses MSAL (SPA) to authenticate users against Azure AD. To test real users against your tenant when the app is hosted on GitHub Pages, follow these steps:

1. Azure AD App Registration
   - Go to Azure Portal -> Azure Active Directory -> App registrations -> New registration.
   - Name: `aivana-be-your-dog` (or similar).
   - Supported account types: choose your required tenant (Single tenant recommended for testing).
   - Redirect URI (Platform -> Single-page application): `https://365evergreen.github.io/aivana-be-your-dog/`

2. Expose and configure API scopes
   - If you need Dataverse delegated scope, add `user_impersonation` under "Expose an API" for the Dataverse resource or use the full resource scope URL. In this project, we call Dataverse at `https://org75c51f0f.crm6.dynamics.com` and request `user_impersonation`.

3. API Permissions (Microsoft Graph & Dataverse)
   - Under "API permissions" -> Add permission -> Microsoft Graph -> Delegated permissions:
     - `User.Read`, `User.ReadBasic.All`, `Sites.ReadWrite.All`, `Files.ReadWrite.All`, `Mail.Read`, `Calendars.Read`
   - For Dataverse: Add the delegated scope `https://org75c51f0f.crm6.dynamics.com/user_impersonation` (or use admin consent for the Dataverse app).
   - Click "Grant admin consent" if you have admin rights (required for many tenant-wide scopes like `Sites.ReadWrite.All`).

4. Authentication settings
   - Under "Authentication", ensure "Allow public client flows" is set appropriately (not required for SPA with PKCE).
   - Ensure the redirect URI above is present.

5. Update `src/msalConfig.js` (clientId)
   - Replace `clientId` with your registered app's Application (client) ID.

6. Test in GitHub Pages
   - Push changes and open `https://365evergreen.github.io/aivana-be-your-dog/`.
   - Use the app's Sign In flow (MSAL) to sign in as a test user in the tenant.

Notes
- Scopes requested in the app must be consented by an admin for tenant-wide access (Graph Sites/Files). For testing a small set of users, an admin can pre-consent.
- For Dataverse access, ensure the Dataverse environment accepts delegated access for the registered app. You may need to register an Azure AD app in the Dynamics/Power Platform admin center or grant consent in the Dataverse environment.
- If you hit CORS issues, verify the Graph and Dataverse endpoints are reachable and the token audience is correct.

If you want, I can generate a step-by-step script to auto-configure the app registration using `az ad app` commands (requires Azure CLI and appropriate permissions).