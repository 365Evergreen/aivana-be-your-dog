import React from 'react';

export default function ConfigCard({ storageKey = 'app.settings.v1' }) {
  const [state, setState] = React.useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : { darkMode: false, compactMode: false };
    } catch (e) {
      return { darkMode: false, compactMode: false };
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent('appSettingsChanged', { detail: state }));
    } catch (e) {}
  }, [state, storageKey]);

  return (
    <div className="config-card">
      <h3>App Settings</h3>
      <label>
        <input
          type="checkbox"
          checked={!!state.darkMode}
          onChange={(e) => setState(s => ({ ...s, darkMode: e.target.checked }))}
        />{' '}
        Dark mode
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={!!state.compactMode}
          onChange={(e) => setState(s => ({ ...s, compactMode: e.target.checked }))}
        />{' '}
        Compact layout
      </label>
    </div>
  );
}
