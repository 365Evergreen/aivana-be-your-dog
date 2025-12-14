let PublicClientApplication;
try {
	// msal-browser expects a browser crypto API; guard for test environments
	PublicClientApplication = require('@azure/msal-browser').PublicClientApplication;
} catch (e) {
	PublicClientApplication = null;
}

import { msalConfig } from "../msalConfig";

// Singleton MSAL instance used across the app and services. In non-browser/test
// environments where `@azure/msal-browser` cannot initialize (missing crypto),
// export a lightweight stub to avoid runtime crashes during tests.
export const msalInstance = (function createInstance() {
	if (PublicClientApplication) {
		try {
			return new PublicClientApplication(msalConfig);
		} catch (e) {
			// fall through to stub below
		}
	}
	return {
		getAllAccounts: () => [],
		loginRedirect: async () => null,
		acquireTokenSilent: async () => { throw new Error('msal not available'); },
		acquireTokenPopup: async () => { throw new Error('msal not available'); },
		acquireTokenRedirect: async () => { throw new Error('msal not available'); },
		logoutRedirect: async () => null,
		config: msalConfig,
	};
})();
