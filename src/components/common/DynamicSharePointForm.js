import React, { useEffect, useState } from 'react';
import { getListColumns, createListItem } from '../../services/sharepoint';
import { SHAREPOINT } from '../../utils/apiConfig';
import { searchUsers, uploadFileToDrive } from '../../services/sharepoint';

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
  function renderPeoplePicker(column, value, onChange) {
    const name = column.name;
    const display = column.displayName || name;
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState([]);

    useEffect(() => {
      let mounted = true;
      async function search() {
        if (!query || query.length < 2) return setOptions([]);
        try {
          const users = await searchUsers(query);
          if (!mounted) return;
          setOptions(users.map(u => ({ id: u.id, label: u.displayName || u.userPrincipalName, upn: u.userPrincipalName, mail: u.mail })));
        } catch (e) {
          // swallow search errors; options remain empty
        }
      }
      search();
      return () => { mounted = false; };
    }, [query]);

    return (
      <div key={name} style={{ marginBottom: 8 }}>
        <label>{display}</label>
        <input placeholder="Search people..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <div style={{ maxHeight: 160, overflow: 'auto', border: '1px solid #ddd' }}>
          {options.map(o => (
            <div key={o.id} style={{ padding: 6, cursor: 'pointer' }} onClick={() => { onChange(name, o.upn || o.mail || o.label); setQuery(''); setOptions([]); }}>
              {o.label} {o.mail ? `(${o.mail})` : ''}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>Selected: {value || 'none'}</div>
      </div>
    );
  }
        <div key={name} style={{ marginBottom: 8 }}>
  function renderFileInput(column, value, onFileSelected) {
    const name = column.name;
    const display = column.displayName || name;
    return (
      <div key={name} style={{ marginBottom: 8 }}>
        <label>{display}</label>
        <input type="file" accept="image/*" capture="environment" onChange={(e) => onFileSelected(name, e.target.files && e.target.files[0])} />
      </div>
    );
  }
          <label>{display}{required ? ' *' : ''}</label>
          <input type="date" value={value || ''} onChange={(e) => onChange(name, e.target.value)} />
        </div>
      );
    const [files, setFiles] = useState({});
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
    function handleFileSelected(name, file) {
      setFiles(f => ({ ...f, [name]: file }));
    }
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

        {columns.map(col => renderFileInput(col, files[col.name], handleFileSelected))}
        {columns.map(col => renderPeoplePicker(col, values[col.name], handleChange))}
  return (
    <form onSubmit={handleSubmit}>
      {columns.map(col => renderInput(col, values[col.name], handleChange))}
      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Submit'}</button>
      </div>
    </form>
  );
}
