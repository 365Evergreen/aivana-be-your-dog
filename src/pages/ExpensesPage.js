import React from 'react';
import DynamicSharePointForm from '../components/common/DynamicSharePointForm';
import { SHAREPOINT } from '../utils/apiConfig';

export default function ExpensesPage() {
  return (
    <div style={{ padding: 20, maxWidth: 900 }}>
      <h2>Expenses</h2>
      <p>Submit an expense using the form below. Fields are loaded from the SharePoint list configuration.</p>
      <DynamicSharePointForm siteId={SHAREPOINT.siteId} listId={SHAREPOINT.expensesListId} onSaved={() => alert('Expense submitted')} />
    </div>
  );
}
