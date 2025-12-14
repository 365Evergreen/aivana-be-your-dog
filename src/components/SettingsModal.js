import React from 'react';
import Modal from './common/Modal';
import { Toggle, Stack } from '@fluentui/react';
import Button from './common/Button';

const SETTINGS_KEY = 'app.settings.v1';

export default function SettingsModal({ open, onClose }) {
  const [showAvatars, setShowAvatars] = React.useState(true);
  const [compactMode, setCompactMode] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (typeof s.showAvatars === 'boolean') setShowAvatars(s.showAvatars);
        if (typeof s.compactMode === 'boolean') setCompactMode(s.compactMode);
        if (typeof s.darkMode === 'boolean') setDarkMode(s.darkMode);
      }
    } catch (e) {}
  }, [open]);

  function save(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      // broadcast change so other parts of the app can react
      window.dispatchEvent(new CustomEvent('appSettingsChanged', { detail: settings }));
    } catch (e) {}
  }

  const onToggleAvatars = (e, checked) => {
    const next = !!checked;
    setShowAvatars(next);
    save({ showAvatars: next, compactMode });
  };

  const onToggleCompact = (e, checked) => {
    const next = !!checked;
    setCompactMode(next);
    save({ showAvatars, compactMode: next });
  };

  const onToggleDark = (e, checked) => {
    const next = !!checked;
    setDarkMode(next);
    save({ showAvatars, compactMode, darkMode: next });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: 16, maxWidth: 480 }}>
        <h3>Settings</h3>
        <Stack tokens={{ childrenGap: 12 }}>
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <div>Show avatars</div>
            <Toggle checked={showAvatars} onChange={onToggleAvatars} />
          </Stack>

          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <div>Compact mode</div>
            <Toggle checked={compactMode} onChange={onToggleCompact} />
          </Stack>

          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <div>Dark mode</div>
            <Toggle checked={darkMode} onChange={onToggleDark} />
          </Stack>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
            <Button onClick={onClose}>Close</Button>
          </div>
        </Stack>
      </div>
    </Modal>
  );
}
