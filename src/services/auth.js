import { msalInstance } from "./msalInstance";
import { loginRequest } from "../msalConfig";

// Lightweight auth helpers used by UI and services.
// These keep implementation minimal: prefer `useMsal` hooks inside components
// for richer UI flows, but these helpers are useful for service-level calls.
export async function login() {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) return accounts[0];
  const resp = await msalInstance.loginPopup(loginRequest);
  return resp.account;
}

export function logout() {
  const account = msalInstance.getAllAccounts()[0];
  return msalInstance.logoutPopup({ account });
}

export async function acquireToken(scopes = loginRequest.scopes) {
  const account = msalInstance.getAllAccounts()[0];
  const request = { scopes, account };
  try {
    const resp = await msalInstance.acquireTokenSilent(request);
    return resp.accessToken;
  } catch (err) {
    // fall back to interactive if silent fails
    const resp = await msalInstance.acquireTokenPopup(request);
    return resp.accessToken;
  }
}

export function getAccount() {
  return msalInstance.getAllAccounts()[0] || null;
}

