// Central API configuration and default scopes for integrations.
export const DATAVERSE = {
  // Update this if you use a different environment
  orgUrl: "https://org75c51f0f.crm6.dynamics.com",
  // Delegated scope for Dataverse (user_impersonation) — ensure this scope is exposed and consented
  scope: "https://org75c51f0f.crm6.dynamics.com/user_impersonation",
  apiVersion: "v9.2",
  // Example entity set from endpoints.md
  exampleEntitySet: "e365_devrecords",
};

export const GRAPH = {
  // Graph scopes used for SharePoint list operations. Ensure these are consented:
  defaultScopes: ["Sites.ReadWrite.All"],
  baseUrl: "https://graph.microsoft.com/v1.0",
};

export const SHAREPOINT = {
  siteUrl: "https://365evergreen.sharepoint.com/sites/powerplatform",
  siteId: "0ec42993-db5d-4121-ab39-96514546799a",
  expensesListId: "c9bd9877-19c1-4f0c-a2ae-e2bece328f6c",
  driveId: "b!kynEDl3bIUGrOZZRRUZ5mqMdwaYzDntDt-Jq3o0v-zIQrHgW0oqPTJCtTYcSOwNz",
};
