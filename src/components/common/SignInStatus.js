import React from 'react';
import { getAccount, login, logout } from '../../services/auth';
import { Persona, PersonaSize, PrimaryButton, DefaultButton } from '@fluentui/react';

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
    return <PrimaryButton text="Sign in" onClick={handleLogin} />;
  }

  const display = account.name || account.username || account.homeAccountId || 'User';
  return (
    <div className="sign-in-status" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Persona text={display} size={PersonaSize.size32} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: 600 }}>{display}</div>
        <DefaultButton text="Sign out" onClick={handleLogout} />
      </div>
    </div>
  );
}
