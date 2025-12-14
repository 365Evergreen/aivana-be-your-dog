import React from 'react';
import { getAccount, login, logout } from '../../services/auth';
import { Persona, PersonaSize } from '@fluentui/react';
import Button from './Button';

export default function SignInStatus() {
  const [account, setAccount] = React.useState(getAccount());

  React.useEffect(() => {
    setAccount(getAccount());
  }, []);

  const handleLogin = async () => {
    try {
      await login();
      setAccount(getAccount());
    } catch (e) {
      // ignore for now
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setAccount(null);
    } catch (e) {}
  };

  if (!account) {
    return <Button variant="primary" onClick={handleLogin}>Sign in</Button>;
  }

  const display = account.name || account.username || account.homeAccountId || 'User';
  return (
    <div className="sign-in-status">
      <Persona text={display} size={PersonaSize.size32} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: 600 }}>{display}</div>
        <Button onClick={handleLogout}>Sign out</Button>
      </div>
    </div>
  );
}
