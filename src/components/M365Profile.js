import React from 'react';
// Button previously used for sign-in; profile is compact so button not needed here
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../msalConfig';
import { acquireToken, getAccount } from '../services/auth';
import { fetchGraph } from '../services/graph';

// Lightweight profile component used in the dashboard header.
// - Uses `useMsal` for interactive flows and `acquireToken` helper for service calls.
// - Keeps UI minimal: shows Sign in / Sign out and basic profile info.
export default function M365Profile() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [profile, setProfile] = React.useState(null);

  React.useEffect(() => {
    // attempt silent SSO when app mounts
    if (!isAuthenticated) {
      instance.ssoSilent?.(loginRequest).catch(() => {});
    }
  }, [isAuthenticated, instance]);

  // login/logout handled by `SignInStatus` in the sidebar; keep helpers available if needed

  React.useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const account = getAccount() || accounts[0];
        if (!account) return;
        const token = await acquireToken();
        const user = await fetchGraph('/me', token);
        if (mounted) setProfile(user);
      } catch (e) {
        // ignore; UI stays simple
      }
    }
    if (isAuthenticated) loadProfile();
    return () => { mounted = false; };
  }, [isAuthenticated, accounts]);

  if (!isAuthenticated) {
    return null;
  }

  // Compact profile shown in header to avoid duplicate sign-out controls
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
      {profile ? (
        <>
          <div style={{ fontWeight: 600, color: 'var(--fluent-text)' }}>{profile.displayName}</div>
          <div style={{ fontSize: 12, color: 'var(--fluent-muted)' }}>{profile.mail || profile.userPrincipalName}</div>
        </>
      ) : (
        <div style={{ color: 'var(--fluent-muted)' }}>Loading profile...</div>
      )}
    </div>
  );
}
