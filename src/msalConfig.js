// msalConfig.js
export const msalConfig = {
  auth: {
    clientId: "95b2244d-b468-44bf-9d50-8a0bd92059a5", // Your Azure AD App clientId
    authority: "https://login.microsoftonline.com/7a5bf294-6ae8-47c4-b0c4-b2f9166d7a3f", // Your tenant ID
    redirectUri:
      window.location.hostname === "localhost"
        ? "http://localhost:3000/"
        : "https://365evergreen.github.io/aivana-be-your-dog/", // Supports local and GitHub Pages
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read", "Mail.Read", "Files.Read", "Calendars.Read"],
};
