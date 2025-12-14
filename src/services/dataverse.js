import { acquireToken } from './auth';
import { DATAVERSE } from '../utils/apiConfig';

const BASE = (DATAVERSE.orgUrl || '').replace(/\/$/, '');
const API_BASE = `${BASE}/api/data/${DATAVERSE.apiVersion || 'v9.2'}`;

function dvHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

async function getToken(scope) {
  const token = await acquireToken(scope ? [scope] : [DATAVERSE.scope]);
  if (!token) throw new Error('Could not acquire Dataverse token');
  return token;
}

export async function queryEntity(entitySet, query = '$top=50', { scopes } = {}) {
  const token = await getToken(scopes && scopes[0]);
  const url = `${API_BASE}/${entitySet}?${query}`;
  const res = await fetch(url, { headers: dvHeaders(token) });
  if (!res.ok) throw new Error(`Dataverse query failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function createRecord(entitySet, record, { scopes } = {}) {
  const token = await getToken(scopes && scopes[0]);
  const url = `${API_BASE}/${entitySet}`;
  const res = await fetch(url, { method: 'POST', headers: dvHeaders(token), body: JSON.stringify(record) });
  if (!res.ok) throw new Error(`Dataverse createRecord failed: ${res.status} ${res.statusText}`);
  return res;
}

export async function updateRecord(entitySet, id, changes, { scopes } = {}) {
  const token = await getToken(scopes && scopes[0]);
  const url = `${API_BASE}/${entitySet}(${id})`;
  const res = await fetch(url, { method: 'PATCH', headers: dvHeaders(token), body: JSON.stringify(changes) });
  if (!res.ok) throw new Error(`Dataverse updateRecord failed: ${res.status} ${res.statusText}`);
  return res;
}

export async function deleteRecord(entitySet, id, { scopes } = {}) {
  const token = await getToken(scopes && scopes[0]);
  const url = `${API_BASE}/${entitySet}(${id})`;
  const res = await fetch(url, { method: 'DELETE', headers: dvHeaders(token) });
  if (!(res.status === 204 || res.status === 200)) throw new Error(`Dataverse deleteRecord failed: ${res.status} ${res.statusText}`);
  return { status: res.status };
}

export default { queryEntity, createRecord, updateRecord, deleteRecord };
