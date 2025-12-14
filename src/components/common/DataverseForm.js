import React, { useState } from 'react';
import { createRecord, updateRecord } from '../../services/dataverse';

export default function DataverseForm({ entitySetName, recordId = null, onSaved }) {
  const [form, setForm] = useState({ title: '', description: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (recordId) {
        await updateRecord(entitySetName, recordId, form);
      } else {
        await createRecord(entitySetName, form);
      }
      onSaved && onSaved();
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
      <div>
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} />
      </div>
      <div>
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  );
}
