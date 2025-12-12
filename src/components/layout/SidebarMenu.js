import React from 'react';
import {
  Home24Regular,
  Mail24Regular,
  Calendar24Regular,
  Folder24Regular,
  Bot24Regular,
  Shield24Regular
} from "@fluentui/react-icons";
import { Nav } from '@fluentui/react';
import { FaGithub } from "react-icons/fa";
import SignInStatus from '../common/SignInStatus';
import SettingsModal from '../SettingsModal';

const BASE_URL = "https://365evergreen.github.io/aivana-be-your-dog";

const navLinks = [
  { to: `${BASE_URL}/#/`, label: "Dashboard", icon: <Home24Regular /> },
  { to: `${BASE_URL}/#/email`, label: "Email", icon: <Mail24Regular /> },
  { to: `${BASE_URL}/#/calendar`, label: "Calendar", icon: <Calendar24Regular /> },
  { to: `${BASE_URL}/#/files`, label: "Files", icon: <Folder24Regular /> },
  { to: `${BASE_URL}/#/ai-assistant`, label: "AI Assistant", icon: <Bot24Regular /> },
  { to: `${BASE_URL}/#/admin`, label: "Admin", icon: <Shield24Regular /> },
];

export default function SidebarMenu() {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const groups = [
    {
      links: navLinks.map((l) => ({ name: l.label, url: l.to, key: l.label })),
    },
  ];

  return (
    <nav className="sidebar-menu">
      <div className="sidebar-user">
        <SignInStatus />
      </div>
      <Nav groups={groups} />
      <div style={{ marginTop: 12 }}>
        <button className="btn-link" onClick={() => setSettingsOpen(true)}>Settings</button>
        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
      <a
        href="https://github.com/365evergreen/aivana-be-your-dog"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', marginTop: 12 }}
      >
        <FaGithub style={{ verticalAlign: "middle", marginRight: 8 }} /> GitHub
      </a>
    </nav>
  );
}
