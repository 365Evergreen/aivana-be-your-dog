// Central API configuration and default scopes for integrations.
export const DATAVERSE = {
  // Update this if you use a different environment
  orgUrl: "https://org75c51f0f.crm6.dynamics.com",
  // Delegated scope for Dataverse (user_impersonation) — ensure this scope is exposed and consented
  scope: "https://org75c51f0f.crm6.dynamics.com/user_impersonation",
  apiVersion: "v9.2",
};

export const GRAPH = {
  // Graph scopes used for SharePoint list operations. Ensure these are consented:
  defaultScopes: ["Sites.ReadWrite.All"],
  baseUrl: "https://graph.microsoft.com/v1.0",
};
