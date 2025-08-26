import React from 'react';
import { NavLink } from 'react-router-dom';

const menu = [
  { label: 'Dashboard', path: '/' },
  { label: 'Email', path: '/email' },
  { label: 'Calendar', path: '/calendar' },
  { label: 'Files', path: '/files' },
  { label: 'AI Assistant', path: '/chat' },
  { label: 'Admin', path: '/admin' },
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
        {menu.map(item => (
          <li key={item.path}>
            <NavLink to={item.path} className={({ isActive }) => isActive ? 'active' : ''} end={item.path === '/'}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
