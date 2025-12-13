import React from 'react';
import DynamicSharePointForm from '../components/common/DynamicSharePointForm';
import { SHAREPOINT } from '../utils/apiConfig';

export default function SharePointFormPage() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Dynamic SharePoint Form</h2>
      <p>Site: {SHAREPOINT.siteUrl}</p>
      <DynamicSharePointForm />
    </div>
  );
}
