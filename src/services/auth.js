import { msalInstance } from "./msalInstance";
import { loginRequest, msalAuthority, msalRedirectUri } from "../msalConfig";

// Lightweight auth helpers used by UI and services.
// These keep implementation minimal: prefer `useMsal` hooks inside components
// for richer UI flows, but these helpers are useful for service-level calls.
export async function login() {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) return accounts[0];

  // If the app is embedded inside an iframe, break out to top to ensure auth runs top-level
  try {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      // navigate top window to this app so auth flows (redirect) run at top-level
      window.top.location.href = window.location.href;
      return null;
    }
  } catch (e) {
    // ignore cross-origin errors and fall back to redirect in current context
  }

  // Use redirect-based interactive sign-in to work reliably on GitHub Pages
  await msalInstance.loginRedirect(loginRequest);
  // loginRedirect does not return a result immediately; caller should react to auth state changes
  return msalInstance.getAllAccounts()[0] || null;
}

export function logout() {
  const account = msalInstance.getAllAccounts()[0];
  return msalInstance.logoutRedirect({ account });
}

export async function acquireToken(scopes = loginRequest.scopes) {
  const account = msalInstance.getAllAccounts()[0];
  const request = { scopes, account };
  try {
    const resp = await msalInstance.acquireTokenSilent(request);
    return resp.accessToken;
  } catch (err) {
    // fall back to interactive if silent fails
    // prefer popup when available (useful in test environments), otherwise redirect
    if (typeof msalInstance.acquireTokenPopup === 'function') {
      const resp = await msalInstance.acquireTokenPopup(request);
      return resp && resp.accessToken ? resp.accessToken : null;
    }
    if (typeof msalInstance.acquireTokenRedirect === 'function') {
      // redirect does not return a token immediately
      await msalInstance.acquireTokenRedirect(request);
      return null;
    }
    return null;
  }
}

export function getAccount() {
  return msalInstance.getAllAccounts()[0] || null;
}

export function adminConsentUrl() {
  // build admin consent URL using authority and redirect URI from config
  try {
    const tenant = (msalAuthority || '').split('/').pop();
    const clientId = (msalInstance && msalInstance.config && msalInstance.config.auth && msalInstance.config.auth.clientId) || '';
    const redirect = encodeURIComponent(msalRedirectUri || '');
    if (!tenant || !clientId || !redirect) return null;
    return `https://login.microsoftonline.com/${tenant}/adminconsent?client_id=${clientId}&redirect_uri=${redirect}`;
  } catch (e) {
    return null;
  }
}

