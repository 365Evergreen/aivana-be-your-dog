import React from 'react';
import DataverseForm from '../components/common/DataverseForm';
import { DATAVERSE } from '../utils/apiConfig';

export default function FormPage() {
  // Example usage: entity set name must be the Dataverse entity set (e.g., contacts, new_requests)
  const exampleEntitySet = 'e365_devrecords';

  return (
    <div style={{ padding: 20 }}>
      <h2>Dataverse Form (example)</h2>
      <p>Submitting this form will create a record in Dataverse (entity set: {exampleEntitySet}).</p>
      <DataverseForm entitySetName={exampleEntitySet} />
      <hr />
      <div style={{ marginTop: 12, color: '#666' }}>
        <strong>Config:</strong>
        <div>Dataverse URL: {DATAVERSE.orgUrl}</div>
        <div>Dataverse scope: {DATAVERSE.scope}</div>
        <div style={{ marginTop: 8 }}><strong>SharePoint</strong></div>
        <div>Site URL: {SHAREPOINT.siteUrl}</div>
        <div>Site ID: {SHAREPOINT.siteId}</div>
        <div>Expenses list ID: {SHAREPOINT.expensesListId}</div>
      </div>
    </div>
  );
}
