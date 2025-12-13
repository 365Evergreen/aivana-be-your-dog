import React from "react";
import { loadTheme } from '@fluentui/react';
import { MsalProvider } from "@azure/msal-react";
import {
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import { msalInstance } from "./services/msalInstance";
import M365Profile from "./components/M365Profile";
import SidebarMenu from "./components/layout/SidebarMenu";
import Dashboard from "./pages/Dashboard";
import EmailPage from "./pages/EmailPage";
import CalendarPage from "./pages/CalendarPage";
import FilesPage from "./pages/FilesPage";
import ChatPage from "./pages/ChatPage";
import AdminPage from "./pages/AdminPage";
import AdminPagesPage from "./pages/AdminPagesPage";
import FloatingCopilotBot from './components/FloatingCopilotBot';
import ThemeToggle from './components/ThemeToggle';

import "./assets/styles/global.css";
import "./assets/styles/dashboard.css";

function App() {
  const [compactMode, setCompactMode] = React.useState(false);

  React.useEffect(() => {
    // read persisted settings
    try {
      const raw = localStorage.getItem('app.settings.v1');
      if (raw) {
        const s = JSON.parse(raw);
        if (s.compactMode) setCompactMode(true);
      }
    } catch (e) {}
    const handler = (e) => {
      try {
        const d = e.detail || {};
        setCompactMode(!!d.compactMode);
        if (typeof d.darkMode === 'boolean') {
          // apply theme at runtime
          applyTheme(!!d.darkMode);
        }
      } catch (err) {}
    };
    window.addEventListener('appSettingsChanged', handler);
    return () => window.removeEventListener('appSettingsChanged', handler);
  }, []);

  // apply initial theme based on stored setting
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('app.settings.v1');
      if (raw) {
        const s = JSON.parse(raw);
        if (typeof s.darkMode === 'boolean') applyTheme(!!s.darkMode);
      }
    } catch (e) {}
  }, []);

  function applyTheme(dark) {
    // set body data attribute for CSS and load Fluent palette
    try {
      if (dark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        loadTheme({
          palette: {
            themePrimary: '#2b88d8',
            neutralPrimary: '#e6e6e6',
            neutralLighterAlt: '#1b1b1d',
            white: '#0b0b0b'
          }
        });
      } else {
        document.documentElement.removeAttribute('data-theme');
        loadTheme({
          palette: {
            themePrimary: '#0063b1',
            neutralPrimary: '#222222',
            neutralLighterAlt: '#f3f2f1',
            white: '#ffffff'
          }
        });
      }
    } catch (e) {}
  }

  return (
    <MsalProvider instance={msalInstance}>
      <div className={`dashboard-root ${compactMode ? 'compact' : ''}`}>
        <ThemeToggle />
        <SidebarMenu />
        <main className="main-content">
          <M365Profile />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/email" element={<EmailPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/files" element={<FilesPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/pages" element={<AdminPagesPage />} />
          </Routes>
        </main>
        <FloatingCopilotBot />
      </div>
    </MsalProvider>
  );
}

export default App;
