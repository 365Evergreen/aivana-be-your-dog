import React from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { Routes, Route } from 'react-router-dom'; // Add this import
import { msalConfig } from './msalConfig';
import M365Profile from './components/M365Profile';
import SidebarMenu from './components/layout/SidebarMenu';
import Dashboard from './pages/Dashboard';
import EmailPage from './pages/EmailPage';
import CalendarPage from './pages/CalendarPage';
import FilesPage from './pages/FilesPage';
import ChatPage from './pages/ChatPage';
import AdminPage from './pages/AdminPage';
import './assets/styles/global.css';
import './assets/styles/dashboard.css';

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
        <div className="dashboard-root">
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
            </Routes>
          </main>
        </div>
    </MsalProvider>
  );
}

export default App;
