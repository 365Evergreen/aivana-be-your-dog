import React from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import { msalConfig } from "./msalConfig";
import M365Profile from "./components/M365Profile";
import SidebarMenu from "./components/layout/SidebarMenu";
import Dashboard from "./pages/Dashboard";
import EmailPage from "./pages/EmailPage";
import CalendarPage from "./pages/CalendarPage";
import FilesPage from "./pages/FilesPage";
import ChatPage from "./pages/ChatPage";
import AdminPage from "./pages/AdminPage";
import AdminPagesPage from "./pages/AdminPagesPage";

import "./assets/styles/global.css";
import "./assets/styles/dashboard.css";

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <div className="dashboard-root">
          <SidebarMenu />
          <main className="main-content">
            <M365Profile />
            <NavLink to="/admin/pages">Page Manager</NavLink> {/* ✅ Now it's valid */}
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
        </div>
      </Router>
    </MsalProvider>
  );
}

export default App;
