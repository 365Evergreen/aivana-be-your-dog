import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home24Regular,
  Mail24Regular,
  Calendar24Regular,
  Folder24Regular,
  Bot24Regular,
  Shield24Regular
} from "@fluentui/react-icons";
import { FaGithub } from "react-icons/fa"; // Added for GitHub icon

const navLinks = [
  { to: "/", label: "Dashboard", icon: <Home24Regular /> },
  { to: "/email", label: "Email", icon: <Mail24Regular /> },
  { to: "/calendar", label: "Calendar", icon: <Calendar24Regular /> },
  { to: "/files", label: "Files", icon: <Folder24Regular /> },
  { to: "/ai-assistant", label: "AI Assistant", icon: <Bot24Regular /> },
  { to: "/admin", label: "Admin", icon: <Shield24Regular /> },
];

export default function SidebarMenu() {
  return (
    <nav className="sidebar-menu">
      <div className="sidebar-user">
        <div className="avatar" />
        <div>
          <div className="user-name">John Doe</div>
          <div className="user-email">john.doe@company.com</div>
        </div>
      </div>
      <ul>
        {navLinks.map(item => (
          <li key={item.to}>
            <NavLink to={item.to} className={({ isActive }) => isActive ? 'active' : ''} end={item.to === '/'}>
              {item.icon}
              {item.label}
            </NavLink>
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
