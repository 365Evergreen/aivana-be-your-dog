import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../msalConfig";

// Singleton MSAL instance used across the app and services
export const msalInstance = new PublicClientApplication(msalConfig);
