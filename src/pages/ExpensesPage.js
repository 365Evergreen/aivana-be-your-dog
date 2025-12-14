import React from 'react';
import ConfigCard from '../components/ConfigCard';
import DynamicSharePointForm from '../components/common/DynamicSharePointForm';

export default function ExpensesPage() {
  return (
    <div className="page expenses-page">
      <header>
        <h1>Expenses</h1>
      </header>
      <section style={{ maxWidth: 900 }}>
        <ConfigCard />
        <p>Use the form below to create an expense item in your configured SharePoint list.</p>
        <DynamicSharePointForm listTitle="Expenses" />
      </section>
    </div>
  );
}
