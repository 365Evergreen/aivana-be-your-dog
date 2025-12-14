import React, { useEffect, useState } from 'react';
import { getListColumns, createListItem, uploadAttachmentToListItem, updateItemFields } from '../../services/sharepoint';
import { SHAREPOINT } from '../../utils/apiConfig';
import { searchUsers, uploadFileToDrive } from '../../services/sharepoint';
import { login } from '../../services/auth';

function RenderPeoplePicker({ column, value, onChange }) {
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
        // swallow search errors
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

function RenderFileInput({ column, value, onFileSelected }) {
  const name = column.name;
  const display = column.displayName || name;
  return (
    <div key={name} style={{ marginBottom: 8 }}>
      <label>{display}</label>
      <input type="file" accept="image/*" capture="environment" onChange={(e) => onFileSelected(name, e.target.files && e.target.files[0])} />
    </div>
  );
}

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
  const [files, setFiles] = useState({});
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
          isPerson: !!c.isPerson,
          isFile: !!c.isFile,
        }));
        setColumns(visible);
        const init = {};
        visible.forEach(c => { init[c.name] = ''; });
        setValues(init);
      } catch (err) {
        // If auth is required, present a friendly message that allows sign-in
        const msg = err && err.message ? err.message : String(err);
        if (msg.toLowerCase().includes('authentication required') || msg.includes('401')) {
          setError('Authentication required to load this form. Please sign in.');
        } else {
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [siteId, listId]);

  async function handleSignIn() {
    try {
      await login();
      // retry loading columns after sign-in
      setError(null);
      setLoading(true);
      const res = await getListColumns(siteId, listId);
      const cols = Array.isArray(res.value) ? res.value : res;
      const visible = cols.filter(c => !c.readOnly && !c.hidden).map(c => ({
        name: c.name,
        displayName: c.displayName,
        required: !!c.required,
        type: c.type || (c.text ? 'text' : undefined),
        choices: c.choices || (c.choice && c.choice.choices) || undefined,
        isPerson: !!c.isPerson,
        isFile: !!c.isFile,
      }));
      setColumns(visible);
      const init = {};
      visible.forEach(c => { init[c.name] = ''; });
      setValues(init);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  function handleChange(name, val) {
    setValues(v => ({ ...v, [name]: val }));
  }

  function handleFileSelected(name, file) {
    setFiles(f => ({ ...f, [name]: file }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const fields = {};
      Object.keys(values).forEach(k => {
        if (values[k] !== '' && values[k] !== null && values[k] !== undefined) {
          const col = columns.find(c => c.name === k);
          if (col && col.isPerson) return; // skip person for now
          if (files && files[k]) return; // skip files
          fields[k] = values[k];
        }
      });

      // separate person fields and files from regular scalar fields
      const personFields = {};
      for (const col of columns) {
        if (col.isPerson && values[col.name]) {
          try {
            const users = await searchUsers(values[col.name]);
            if (users && users.length > 0) {
              personFields[col.name] = users[0].id;
            }
          } catch (e) {
            // ignore
          }
        }
      }

      // create item with scalar fields first
      const created = await createListItem(siteId, listId, fields);
      const itemId = (created && created.id) || (created && created.fields && created.fields.Id) || null;

      // upload attachments to the created item
      if (itemId) {
        for (const fname of Object.keys(files)) {
          const file = files[fname];
          if (!file) continue;
          await uploadAttachmentToListItem(siteId, listId, itemId, file);
        }

        // set person fields via fields PATCH using LookupId convention
        for (const [colName, userId] of Object.entries(personFields)) {
          const patch = {};
          patch[`${colName}LookupId`] = userId;
          try {
            await updateItemFields(siteId, listId, itemId, patch);
          } catch (e) {
            // ignore patch errors for now
          }
        }
      } else {
        // fallback: if no itemId returned, still try to upload files to drive and set URLs in a field
        for (const fname of Object.keys(files)) {
          const file = files[fname];
          if (!file) continue;
          const driveId = SHAREPOINT.driveId;
          const remoteName = `${Date.now()}_${file.name}`;
          const uploaded = await uploadFileToDrive(driveId, remoteName, file);
          fields[fname] = uploaded.webUrl || uploaded['webUrl'] || uploaded['@microsoft.graph.downloadUrl'] || uploaded['id'];
        }
        // create final item
        await createListItem(siteId, listId, fields);
      }
      onSaved && onSaved();
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading form...</div>;
  if (error) {
    // Show sign-in button for authentication-related errors
    if ((error || '').toLowerCase().includes('authentication required') || (error || '').includes('msal')) {
      return (
        <div style={{ color: 'red' }}>
          <div>Error: {error}</div>
          <div style={{ marginTop: 8 }}>
            <button onClick={handleSignIn}>Sign in to continue</button>
          </div>
        </div>
      );
    }
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {columns.map(col => {
        if (col.isPerson) {
          return <RenderPeoplePicker key={col.name} column={col} value={values[col.name]} onChange={handleChange} />;
        }
        if (col.isFile) {
          return <RenderFileInput key={col.name} column={col} value={files[col.name]} onFileSelected={handleFileSelected} />;
        }
        return renderInput(col, values[col.name], handleChange);
      })}
      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Submit'}</button>
      </div>
    </form>
  );
}
