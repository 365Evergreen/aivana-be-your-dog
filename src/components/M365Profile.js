import React from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../msalConfig';
import { Client } from '@microsoft/microsoft-graph-client';

const M365Profile = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [profile, setProfile] = React.useState(null);


  // Try silent SSO on mount
  React.useEffect(() => {
    if (!isAuthenticated) {
      instance.ssoSilent(loginRequest).catch(() => {
        // fallback: do nothing, show sign in button
      });
    }
  }, [isAuthenticated, instance]);

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  React.useEffect(() => {
    if (isAuthenticated && accounts.length > 0) {
      const accessTokenRequest = {
        ...loginRequest,
        account: accounts[0],
      };
      instance.acquireTokenSilent(accessTokenRequest).then(response => {
        const client = Client.init({
          authProvider: (done) => {
            done(null, response.accessToken);
          },
        });
        client.api('/me').get().then(user => setProfile(user));
      });
    }
  }, [isAuthenticated, accounts, instance]);

  if (!isAuthenticated) {
    return <button onClick={handleLogin}>Sign in with Microsoft 365</button>;
  }

  return profile ? (
    <div style={{margin: '1rem 0'}}>
      <h3>Welcome, {profile.displayName}</h3>
      <p>Email: {profile.mail || profile.userPrincipalName}</p>
    </div>
  ) : <div>Loading profile...</div>;
};

export default M365Profile;
