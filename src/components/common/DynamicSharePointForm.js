import React, { useEffect, useState } from 'react';
import { getListColumns, createListItem } from '../../services/sharepoint';
import { SHAREPOINT } from '../../utils/apiConfig';

function renderInput(column, value, onChange) {
  const name = column.name;
  const display = column.displayName || name;
  const required = column.required || false;

  const type = column.type || 'text';

  if (column.choices && Array.isArray(column.choices)) {
    return (
      <div key={name} style={{ marginBottom: 8 }}>
        <label>{display}{required ? ' *' : ''}</label>
        <select value={value || ''} onChange={(e) => onChange(name, e.target.value)}>
          <option value="">-- select --</option>
          {column.choices.map((c) => <option key={c.value || c} value={c.value || c}>{c.name || c}</option>)}
        </select>
      </div>
    );
  }

  switch (type) {
    case 'boolean':
      return (
        <div key={name} style={{ marginBottom: 8 }}>
          <label>
            <input type="checkbox" checked={!!value} onChange={(e) => onChange(name, e.target.checked)} /> {display}
          </label>
        </div>
      );
    case 'number':
      return (
        <div key={name} style={{ marginBottom: 8 }}>
          <label>{display}{required ? ' *' : ''}</label>
          <input type="number" value={value || ''} onChange={(e) => onChange(name, e.target.value)} />
        </div>
      );
    case 'dateTime':
    case 'date':
      return (
        <div key={name} style={{ marginBottom: 8 }}>
          <label>{display}{required ? ' *' : ''}</label>
          <input type="date" value={value || ''} onChange={(e) => onChange(name, e.target.value)} />
        </div>
      );
    default:
      return (
        <div key={name} style={{ marginBottom: 8 }}>
          <label>{display}{required ? ' *' : ''}</label>
          <input type="text" value={value || ''} onChange={(e) => onChange(name, e.target.value)} />
        </div>
      );
  }
}

export default function DynamicSharePointForm({ siteId = SHAREPOINT.siteId, listId = SHAREPOINT.expensesListId, onSaved }) {
  const [columns, setColumns] = useState([]);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await getListColumns(siteId, listId);
        const cols = Array.isArray(res.value) ? res.value : res;
        if (!mounted) return;
        const visible = cols.filter(c => !c.readOnly && !c.hidden).map(c => ({
          name: c.name,
          displayName: c.displayName,
          required: !!c.required,
          type: c.type || (c.text ? 'text' : undefined),
          choices: c.choices || (c.choice && c.choice.choices) || undefined,
        }));
        setColumns(visible);
        const init = {};
        visible.forEach(c => { init[c.name] = ''; });
        setValues(init);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [siteId, listId]);

  function handleChange(name, val) {
    setValues(v => ({ ...v, [name]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const fields = {};
      Object.keys(values).forEach(k => {
        if (values[k] !== '' && values[k] !== null && values[k] !== undefined) fields[k] = values[k];
      });
      await createListItem(siteId, listId, fields);
      onSaved && onSaved();
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading form...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      {columns.map(col => renderInput(col, values[col.name], handleChange))}
      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Submit'}</button>
      </div>
    </form>
  );
}
