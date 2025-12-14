import React from 'react';
import {
  HomeRegular,
  MailRegular,
  CalendarRegular,
  FolderRegular,
  PersonChatRegular,
  ShieldRegular,
  ChevronLeft24Regular,
  ChevronRight24Regular,
  AppsRegular
} from "@fluentui/react-icons";
import { FaGithub } from "react-icons/fa";
import SignInStatus from '../common/SignInStatus';
import SettingsModal from '../SettingsModal';
import Button from '../common/Button';

// icons imported from @fluentui/react-icons

const navLinks = [
  { to: '#/', label: "Dashboard", icon: <HomeRegular /> },
  { to: '#/email', label: "Email", icon: <MailRegular /> },
  { to: '#/calendar', label: "Calendar", icon: <CalendarRegular /> },
  { to: '#/files', label: "Files", icon: <FolderRegular /> },
  { to: '#/ai-assistant', label: "AI Assistant", icon: <PersonChatRegular /> },
  { to: '#/admin', label: "Admin", icon: <ShieldRegular /> },
  { to: '#/planner', label: "Planner", icon: <AppsRegular /> },
  { to: '#/auth-diag', label: "Auth Diag", icon: <AppsRegular /> },
];

const SIDEBAR_KEY = 'sidebar.collapsed.v1';

export default function SidebarMenu() {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(() => {
    try {
      const raw = localStorage.getItem(SIDEBAR_KEY);
      return raw === '1';
    } catch { return false; }
  });
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    try { localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0'); } catch {}
  }, [collapsed]);

  // close mobile when viewport becomes large
  React.useEffect(() => {
    const m = window.matchMedia('(min-width: 640px)');
    const onChange = () => { if (m.matches) setMobileOpen(false); };
    m.addEventListener?.('change', onChange);
    return () => m.removeEventListener?.('change', onChange);
  }, []);

  return (
    <>
      <div className={`sidebar-menu ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="sidebar-top">
          <div className="sidebar-user">
            <SignInStatus />
          </div>
          <div className="sidebar-controls">
            <Button
              className="collapse-toggle"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setCollapsed(s => !s)}
              icon={collapsed ? <ChevronRight24Regular /> : <ChevronLeft24Regular />}
              variant="plain"
            />
          </div>
        </div>

        <ul className="sidebar-links" role="menu">
          {navLinks.map(l => (
            <li key={l.label} className="nav-item" role="none">
              <a
                href={l.to}
                className="nav-link"
                role="menuitem"
                tabIndex={0}
                onClick={() => setMobileOpen(false)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = l.to; } }}
              >
                <span className="nav-icon">{l.icon}</span>
                <span className="nav-text">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div style={{ marginBottom: 8 }}>
            <Button onClick={() => setSettingsOpen(true)}>Settings</Button>
            <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
          </div>
          <a
            href="https://github.com/365Evergreen/aivana-be-your-dog"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <FaGithub style={{ verticalAlign: "middle", marginRight: 8 }} /> <span className="nav-text">GitHub</span>
          </a>
        </div>
      </div>

      <Button className="sidebar-hamburger" aria-label="Open sidebar" onClick={() => setMobileOpen(true)} icon={<AppsRegular />} variant="plain" />
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}
    </>
  );
}
