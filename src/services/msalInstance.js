import { msalConfig } from "../msalConfig";

let PublicClientApplication;
try {
	// msal-browser expects a browser crypto API; guard for test environments
	const msalPkg = require('@azure/msal-browser');
	// support different bundler interop shapes
	PublicClientApplication = msalPkg.PublicClientApplication || msalPkg.default || msalPkg;
	// if the package itself is a namespace, but the class is the default export
	if (PublicClientApplication && PublicClientApplication.PublicClientApplication) {
		PublicClientApplication = PublicClientApplication.PublicClientApplication;
	}
} catch (e) {
	PublicClientApplication = null;
}

// Singleton MSAL instance used across the app and services. In non-browser/test
// environments where `@azure/msal-browser` cannot initialize (missing crypto),
// export a lightweight stub to avoid runtime crashes during tests.
export const msalInstance = (function createInstance() {
	let _initError = null;
	if (PublicClientApplication) {
		try {
			const real = new PublicClientApplication(msalConfig);
			// mark as real instance
			try { real.__isStub = false; } catch {};
			console.log('[msalInstance] Real MSAL client initialized successfully');
			return real;
		} catch (e) {
			_initError = e && e.message ? e.message : String(e);
			// log to console for deployed diagnostics
			console.error('[msalInstance] Real MSAL init failed:', e);
			// fall through to stub below
		}
	} else {
		console.warn('[msalInstance] PublicClientApplication not available; using stub');
	}
	// Minimal stub implementation to satisfy `@azure/msal-react` expectations at runtime
	console.warn('[msalInstance] Returning stub instance (auth flows will be no-ops)');
	let _callbackId = 1;
	const noop = () => { };
	const makeLogger = (name, ver) => {
		const logger = {
			verbose: noop,
			info: noop,
			warning: noop,
			error: noop,
			log: noop,
			// clone returns a new logger (or same) to match msal-react usage
			clone: () => logger,
		};
		return logger;
	};

	return {
		getAllAccounts: () => [],
		loginRedirect: async () => {
			console.warn('[msalInstance stub] loginRedirect called but this is a stub - no action taken');
			return null;
		},
		// Token helpers resolve to a null-ish response instead of throwing so callers
		// can fall back to interactive flows or handle absence of tokens gracefully.
		acquireTokenSilent: async (request) => ({ accessToken: null }),
		acquireTokenPopup: async (request) => ({ accessToken: null }),
		acquireTokenRedirect: async (request) => ({ accessToken: null }),
		logoutRedirect: async () => null,
		config: msalConfig,
		// msal-react expects getLogger().clone(name, version)
		getLogger: () => makeLogger(),
		// lifecycle/event methods used by MsalProvider
		initializeWrapperLibrary: noop,
		addEventCallback: (cb) => {
			// return a callback id
			const id = _callbackId++;
			// no-op: we don't fire events in the stub
			return id;
		},
		removeEventCallback: (id) => { /* no-op */ },
		initialize: async () => { return; },
		handleRedirectPromise: async () => { return; },
		// expose diagnostic properties so UI can surface why MSAL fell back to stub
		__isStub: true,
		__initError: _initError,
	};
})();
