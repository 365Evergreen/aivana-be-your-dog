import React, { useEffect, useState } from 'react';
import { msalInstance } from '../services/msalInstance';
import { msalConfig, loginRequest } from '../msalConfig';
import { acquireToken, login, adminConsentUrl } from '../services/auth';

export default function AuthDiagnostics() {
  const [accounts, setAccounts] = useState([]);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [error, setError] = useState(null);
  const [attempting, setAttempting] = useState(false);

  useEffect(() => {
    try {
      const acc = (msalInstance && typeof msalInstance.getAllAccounts === 'function') ? msalInstance.getAllAccounts() : [];
      setAccounts(acc || []);
    } catch (e) {
      setError(String(e));
    }
  }, []);

  async function tryAcquire() {
    setAttempting(true);
    setError(null);
    setTokenInfo(null);
    try {
      const t = await acquireToken(loginRequest.scopes);
      setTokenInfo(t || null);
    } catch (e) {
      setError(e && e.message ? e.message : String(e));
    } finally {
      setAttempting(false);
    }
  }

  function openAdminConsent() {
    try {
      const url = adminConsentUrl();
      if (!url) {
        setError('Admin consent URL not available (check msalConfig).');
        return;
      }
      // open in new tab so user can sign in/consent without losing diagnostics view
      window.open(url, '_blank');
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Authentication Diagnostics</h2>
      <div style={{ marginBottom: 12 }}><strong>msalConfig.redirectUri:</strong> {msalConfig.auth.redirectUri}</div>
      <div style={{ marginBottom: 12 }}><strong>Login request scopes:</strong> {JSON.stringify(loginRequest.scopes)}</div>
      <div style={{ marginBottom: 12 }}>
        <strong>Accounts:</strong>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(accounts, null, 2)}</pre>
      </div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => login()}>Trigger Sign-in (redirect)</button>
        <button style={{ marginLeft: 8 }} onClick={tryAcquire} disabled={attempting}>{attempting ? 'Trying...' : 'Acquire Token (silent/popup)'}</button>
      </div>
      {msalInstance && msalInstance.__isStub && (
        <div style={{ marginTop: 12, color: '#b04' }}>
          <div><strong>Notice:</strong> MSAL appears to be running in a stubbed mode in this build.</div>
          <div style={{ marginTop: 6 }}>Init error: <pre style={{ whiteSpace: 'pre-wrap' }}>{String(msalInstance.__initError || 'none')}</pre></div>
          <div style={{ marginTop: 8 }}>
            <button onClick={openAdminConsent}>Open Admin Consent / Sign-in page</button>
          </div>
        </div>
      )}
      {tokenInfo && (
        <div style={{ marginTop: 12 }}>
          <strong>Token (first 200 chars):</strong>
          <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto' }}>{String(tokenInfo).slice(0,200)}{String(tokenInfo).length>200? '...' : ''}</pre>
        </div>
      )}
      {error && (
        <div style={{ marginTop: 12, color: 'red' }}>
          <strong>Error:</strong>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      )}
    </div>
  );
}
