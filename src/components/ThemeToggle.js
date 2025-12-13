import React from 'react';
import { loadTheme } from '@fluentui/react';
import Button from './common/Button';

function MoonIcon(props){
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" {...props}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
    </svg>
  );
}
function SunIcon(props){
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false" {...props}>
      <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10 8h2v-3h-2v3zm8.83-16.95l-1.79 1.79 1.8 1.8 1.79-1.8-1.8-1.79zM17.24 19.16l1.8 1.79 1.79-1.79-1.79-1.8-1.8 1.8zM20 13h3v-2h-3v2zM12 4a1 1 0 110 2 1 1 0 010-2zm0 14a1 1 0 110 2 1 1 0 010-2zM6.76 19.16l-1.8 1.79 1.79 1.79 1.8-1.79-1.79-1.79z" fill="currentColor" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

export default function ThemeToggle(){
  const [dark, setDark] = React.useState(() => {
    try{
      const raw = localStorage.getItem('app.settings.v1');
      if (!raw) return false;
      const s = JSON.parse(raw);
      return !!s.darkMode;
    }catch(e){return false;}
  });

  React.useEffect(() => {
    // keep state in sync with external changes
    const handler = (e) => {
      try{ const d = (e && e.detail) || {}; setDark(!!d.darkMode); }catch(e){}
    };
    window.addEventListener('appSettingsChanged', handler);
    return () => window.removeEventListener('appSettingsChanged', handler);
  }, []);

  function applyTheme(darkMode){
    try{
      if (darkMode){
        document.documentElement.setAttribute('data-theme','dark');
        loadTheme({ palette: { themePrimary: '#2b88d8', neutralPrimary: '#e6e6e6', neutralLighterAlt: '#1b1b1d', white: '#0b0b0b' } });
      } else {
        document.documentElement.removeAttribute('data-theme');
        loadTheme({ palette: { themePrimary: '#0063b1', neutralPrimary: '#222222', neutralLighterAlt: '#f3f2f1', white: '#ffffff' } });
      }
    }catch(e){}
  }

  function toggle(){
    const newVal = !dark;
    setDark(newVal);
    // persist
    try{
      const raw = localStorage.getItem('app.settings.v1');
      const s = raw ? JSON.parse(raw) : {};
      s.darkMode = !!newVal;
      localStorage.setItem('app.settings.v1', JSON.stringify(s));
    }catch(e){}
    // fire event so App.js will pick it up as well
    applyTheme(newVal);
    try{ window.dispatchEvent(new CustomEvent('appSettingsChanged',{ detail: { darkMode: !!newVal } })); }catch(e){}
  }

  return (
    <Button aria-label="Toggle theme" title="Toggle theme" onClick={toggle} className="theme-toggle" icon={dark ? <SunIcon /> : <MoonIcon />} variant="plain" />
  );
}
