import React from 'react';

export default function AdminPage() {
  return (
    <div className="admin-page">
      <h1>Admin Configuration</h1>
      <section>
        <h2>User Management</h2>
        <p>Manage users, roles, and permissions here.</p>
        {/* Future: Add user list, add/remove user, assign roles */}
      </section>
      <section>
        <h2>App Settings</h2>
        <p>Configure application-wide settings here.</p>
        {/* Future: Add settings form, save button, etc. */}
      </section>
      <section>
        <h2>Audit Logs</h2>
        <p>View recent admin actions and audit logs.</p>
        {/* Future: Add audit log table */}
      </section>
    </div>
  );
}
