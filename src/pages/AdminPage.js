import React from "react";
import { PrimaryButton, DefaultButton } from '@fluentui/react';

export default function AdminPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontWeight: 700, fontSize: 32, marginBottom: 24, color: "#2563eb" }}>
        Portal Configuration
      </h1>
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", padding: 32, marginBottom: 32 }}>
        <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 12 }}>Portal Configuration</h2>
        <div style={{ marginBottom: 18, color: "#f59e42", fontWeight: 500 }}>
          <span style={{ background: "#fff7e6", padding: "4px 12px", borderRadius: 6 }}>Demo Mode</span>
          <span style={{ marginLeft: 16, color: "#888" }}>
            The portal is currently running in demo mode with mock data and simulated authentication.
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
          <div style={{ flex: 1, background: "#f8fafc", borderRadius: 10, padding: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Authentication Mode</div>
            <div style={{ color: "#2563eb" }}>Current auth system</div>
          </div>
          <div style={{ flex: 1, background: "#f8fafc", borderRadius: 10, padding: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>SharePoint Config</div>
            <div style={{ color: "#2563eb" }}>Credentials stored</div>
          </div>
          <div style={{ flex: 1, background: "#f8fafc", borderRadius: 10, padding: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Data Source</div>
            <div style={{ color: "#2563eb" }}>Contact provider</div>
          </div>
        </div>
        <div style={{ background: "#f1f5f9", borderRadius: 10, padding: 18, marginBottom: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Current Configuration</div>
          <div style={{ color: "#444" }}>
            <div>Environment: <b>development</b></div>
            <div>Authenticator: <b>Demo Mode</b></div>
            <div>Data Sources: <b>Mock Data</b></div>
            <div>SharePoint Tenant: <b>365evergreen</b></div>
            <div>Client ID: <b>95b2244d-b468-44bf-9d50-8a0bd92059a5</b></div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <PrimaryButton styles={{ root: { background: '#2563eb', color: '#fff' } }}>Test SharePoint Connection</PrimaryButton>
          <DefaultButton>Clear Cache</DefaultButton>
          <DefaultButton>Export Configuration</DefaultButton>
          <DefaultButton>View System Logs</DefaultButton>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", padding: 32 }}>
        <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 12 }}>System Information</h2>
        <div style={{ color: "#444" }}>
          <div>Portal Version: <b>v2.0</b></div>
          <div>Platform: <b>React + SharePoint</b></div>
          <div>Environment: <b>Production</b></div>
          <div>Authentication: <b>Azure AD B2B</b></div>
          <div>Data Store: <b>SharePoint Online</b></div>
          <div>Last Updated: <b>{new Date().toLocaleDateString("en-AU")}</b></div>
        </div>
      </div>
      <div style={{ marginTop: 32, background: "#f8fafc", borderRadius: 10, padding: 18 }}>
        <b>Configuration Tips</b>
        <ul style={{ color: "#888", fontSize: 15 }}>
          <li>Demo Mode is perfect for development and testing without Azure AD setup.</li>
          <li>Live Mode requires proper Azure AD app registration and SharePoint permissions.</li>
          <li>Configuration changes take effect immediately but may require a page refresh.</li>
          <li>All settings are stored locally in browser storage for this demo.</li>
        </ul>
      </div>
    </div>
  );
}
