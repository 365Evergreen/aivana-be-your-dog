import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { msalInstance } from './services/msalInstance';
import { loadTheme } from '@fluentui/react';

// lightweight Fluent theme aligned with CSS tokens
loadTheme({
  palette: {
    themePrimary: '#0063b1',
    themeLighter: '#cfe7fb',
    themeLighterAlt: '#eaf6ff',
    themeDarkAlt: '#00549a',
    themeDarker: '#003a6f',
    neutralPrimary: '#222222',
    neutralSecondary: '#666666',
    neutralLighterAlt: '#f3f2f1',
    white: '#ffffff',
    black: '#000000',
  },
  semanticColors: {
    bodyBackground: '#f8f9fa',
    bodyText: '#222222',
    link: '#0063b1',
  }
});

async function bootstrap() {
  try {
    if (msalInstance && typeof msalInstance.initialize === 'function') {
      await msalInstance.initialize();
    }
  } catch (e) {
    // initialization failure should not block the app entirely; log for diagnostics
    // eslint-disable-next-line no-console
    console.error('MSAL initialization failed:', e);
  }

  // If the app is currently embedded inside an iframe, break out to the top-level window
  // to ensure authentication flows run at top-level (avoid iframe sandbox/COOP issues).
  try {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      // avoid infinite loop for embedded widgets by only breaking out for our known origin
      const allowedOrigin = new URL(msalInstance.config.auth.redirectUri).origin;
      if (window.top && window.location && window.location.origin === allowedOrigin) {
        window.top.location.href = window.location.href;
        return; // stop bootstrapping until top has reloaded
      }
    }
  } catch (e) {
    // ignore cross-origin access errors
  }

  ReactDOM.render(
    <HashRouter>
      <App />
    </HashRouter>,
    document.getElementById("root")
  );
}

bootstrap();
