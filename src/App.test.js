import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock MSAL provider and hooks so App renders deterministically in tests
jest.mock('@azure/msal-react', () => {
  const React = require('react');
  return {
    MsalProvider: ({ children }) => React.createElement(React.Fragment, null, children),
    useMsal: () => ({ instance: {}, accounts: [] }),
    useIsAuthenticated: () => false,
  };
});

// Mock msal instance module
jest.mock('./services/msalInstance', () => ({ msalInstance: {} }));

// Replace heavy UI components with light placeholders
jest.mock('./components/M365Profile', () => {
  const React = require('react');
  return () => React.createElement('div', null, 'MockProfile');
});
jest.mock('./components/layout/SidebarMenu', () => {
  const React = require('react');
  return () => React.createElement('div', null, 'MockSidebar');
});
jest.mock('./components/FloatingCopilotBot', () => {
  const React = require('react');
  return () => React.createElement('div', null, 'MockBot');
});
jest.mock('./pages/Dashboard', () => {
  const React = require('react');
  return () => React.createElement('div', null, 'DashboardPage');
});
jest.mock('./pages/EmailPage', () => {
  const React = require('react');
  return () => React.createElement('div', null, 'EmailPage');
});
jest.mock('./pages/CalendarPage', () => {
  const React = require('react');
  return () => React.createElement('div', null, 'CalendarPage');
});
jest.mock('./pages/FilesPage', () => {
  const React = require('react');
  return () => React.createElement('div', null, 'FilesPage');
});
jest.mock('./pages/ChatPage', () => {
  const React = require('react');
  return () => React.createElement('div', null, 'ChatPage');
});
jest.mock('./pages/AdminPage', () => {
  const React = require('react');
  return () => React.createElement('div', null, 'AdminPage');
});
jest.mock('./pages/AdminPagesPage', () => {
  const React = require('react');
  return () => React.createElement('div', null, 'AdminPagesPage');
});

// Lightweight router mocks so NavLink/Routes/Route don't require full react-router behavior
jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    Routes: ({ children }) => React.createElement(React.Fragment, null, children),
    Route: ({ element }) => element,
    NavLink: ({ children }) => React.createElement('a', null, children),
  };
}, { virtual: true });

test('renders App shell with mocked components', () => {
  render(<App />);
  expect(screen.getByText(/MockProfile/i)).toBeInTheDocument();
  expect(screen.getByText(/Page Manager/i)).toBeInTheDocument();
});
