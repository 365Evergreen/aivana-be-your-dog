// msalConfig.js
export const msalConfig = {
  auth: {
    clientId: "95b2244d-b468-44bf-9d50-8a0bd92059a5", // Your Azure AD App clientId
    authority: "https://login.microsoftonline.com/7a5bf294-6ae8-47c4-b0c4-b2f9166d7a3f", // Your tenant ID
    redirectUri: "https://365evergreen.github.io/aivana-be-your-dog/", // Supports local and GitHub Pages
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: [
    "openid",
    "profile",
    "offline_access",
    "User.Read",
    "User.ReadBasic.All",
    "Mail.Read",
    "Files.ReadWrite.All",
    "Calendars.Read",
    "Sites.ReadWrite.All",
    // Dataverse delegated scope (configured in src/utils/apiConfig.js)
    "https://org75c51f0f.crm6.dynamics.com/user_impersonation",
  ],
};
