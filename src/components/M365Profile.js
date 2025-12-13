import React from 'react';
import Button from './common/Button';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../msalConfig';
import { acquireToken, logout, getAccount } from '../services/auth';
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

  const handleLogin = () => instance.loginPopup(loginRequest);
  const handleLogout = () => logout();

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
    return <Button variant="primary" onClick={handleLogin}>Sign in</Button>;
  }

  return (
    <div style={{ margin: '1rem 0' }}>
      {profile ? (
        <>
          <h3>Welcome, {profile.displayName}</h3>
          <p>{profile.mail || profile.userPrincipalName}</p>
        </>
      ) : (
        <div>Loading profile...</div>
      )}
      <Button onClick={handleLogout} className="ml-8">Sign out</Button>
    </div>
  );
}
