import { acquireToken } from './auth';
import { GRAPH } from '../utils/apiConfig';

const GRAPH_BASE = GRAPH.baseUrl;

async function graphToken(scopes = GRAPH.defaultScopes) {
  return await acquireToken(scopes);
}

function graphHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}

export async function getListItems(siteId, listId, { scopes } = {}) {
  const token = await graphToken(scopes || GRAPH.defaultScopes);
  const url = `${GRAPH_BASE}/sites/${siteId}/lists/${listId}/items`;
  const res = await fetch(url, { headers: graphHeaders(token) });
  if (!res.ok) throw new Error(`Graph getListItems failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function getListColumns(siteId, listId, { scopes } = {}) {
  const token = await graphToken(scopes || GRAPH.defaultScopes);
  const url = `${GRAPH_BASE}/sites/${siteId}/lists/${listId}/columns`;
  const res = await fetch(url, { headers: graphHeaders(token) });
  if (!res.ok) throw new Error(`Graph getListColumns failed: ${res.status} ${res.statusText}`);
  return res.json();
}

// Search users in the tenant by displayName (simple helper for people picker)
export async function searchUsers(query, { scopes } = {}) {
  if (!query || query.length < 2) return [];
  const token = await graphToken(scopes || GRAPH.defaultScopes);
  // use startsWith on displayName; ensure the app has User.ReadBasic.All or similar consent
  const url = `${GRAPH_BASE}/users?$filter=startsWith(displayName,'${encodeURIComponent(query)}')&$select=id,displayName,mail,userPrincipalName&$top=10`;
  const res = await fetch(url, { headers: graphHeaders(token) });
  if (!res.ok) throw new Error(`Graph searchUsers failed: ${res.status} ${res.statusText}`);
  const json = await res.json();
  return Array.isArray(json.value) ? json.value : [];
}

// Upload a file blob to a drive and return the uploaded item metadata (webUrl etc.)
export async function uploadFileToDrive(driveId, path, fileBlob, { scopes } = {}) {
  if (!driveId) throw new Error('driveId is required to upload files');
  const token = await graphToken(scopes || GRAPH.defaultScopes);
  const filename = path.replace(/^\/+/, '');
  const url = `${GRAPH_BASE}/drives/${driveId}/root:/${encodeURIComponent(filename)}:/content`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: Object.assign({}, graphHeaders(token), { 'Content-Type': fileBlob.type || 'application/octet-stream' }),
    body: fileBlob,
  });
  if (!res.ok) throw new Error(`Graph uploadFileToDrive failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function createListItem(siteId, listId, fields, { scopes } = {}) {
  const token = await graphToken(scopes || GRAPH.defaultScopes);
  const url = `${GRAPH_BASE}/sites/${siteId}/lists/${listId}/items`;
  const body = { fields };
  const res = await fetch(url, { method: 'POST', headers: graphHeaders(token), body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Graph createListItem failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function updateListItem(siteId, listId, itemId, fields, { scopes } = {}) {
  const token = await graphToken(scopes || GRAPH.defaultScopes);
  const url = `${GRAPH_BASE}/sites/${siteId}/lists/${listId}/items/${itemId}/fields`;
  const res = await fetch(url, { method: 'PATCH', headers: graphHeaders(token), body: JSON.stringify(fields) });
  if (!res.ok) throw new Error(`Graph updateListItem failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function deleteListItem(siteId, listId, itemId, { scopes } = {}) {
  const token = await graphToken(scopes || GRAPH.defaultScopes);
  const url = `${GRAPH_BASE}/sites/${siteId}/lists/${listId}/items/${itemId}`;
  const res = await fetch(url, { method: 'DELETE', headers: graphHeaders(token) });
  if (res.status !== 204) throw new Error(`Graph deleteListItem failed: ${res.status} ${res.statusText}`);
  return { status: res.status };
}

export default { getListItems, createListItem, updateListItem, deleteListItem };
