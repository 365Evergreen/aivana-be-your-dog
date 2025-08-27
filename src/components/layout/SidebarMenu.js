import React from 'react';
import {
  Home24Regular,
  Mail24Regular,
  Calendar24Regular,
  Folder24Regular,
  Bot24Regular,
  Shield24Regular
} from "@fluentui/react-icons";
import { FaGithub } from "react-icons/fa";

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
  return (
    <nav className="sidebar-menu">
      <div className="sidebar-user">
        <div className="avatar" />
      </div>
      <ul>
        {navLinks.map(item => (
          <li key={item.to}>
            <a href={item.to}>
              {item.icon}
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <a
        href="https://github.com/365evergreen/aivana-be-your-dog"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub style={{ verticalAlign: "middle", marginRight: 8 }} /> GitHub
      </a>
    </nav>
  );
}
