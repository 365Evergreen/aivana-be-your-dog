import { acquireToken } from './auth';
import { DATAVERSE } from '../utils/apiConfig';

const API_VERSION = DATAVERSE.apiVersion || 'v9.2';

function baseUrl(orgUrl = DATAVERSE.orgUrl) {
  return `${orgUrl}/api/data/${API_VERSION}`.replace(/\/+/g, '/');
}

async function authToken(scope = DATAVERSE.scope) {
  if (!scope) throw new Error('Dataverse scope not configured.');
  return await acquireToken([scope]);
}

export async function getRecords(entitySetName, { orgUrl } = {}) {
  const token = await authToken();
  const url = `${baseUrl(orgUrl)}/${entitySetName}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Dataverse getRecords failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function getRecord(entitySetName, id, { orgUrl } = {}) {
  const token = await authToken();
  const url = `${baseUrl(orgUrl)}/${entitySetName}(${id})`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Dataverse getRecord failed: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function createRecord(entitySetName, data, { orgUrl } = {}) {
  const token = await authToken();
  const url = `${baseUrl(orgUrl)}/${entitySetName}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!(res.status === 201 || res.status === 204)) throw new Error(`Dataverse createRecord failed: ${res.status} ${res.statusText}`);
  // Dataverse returns 204/No Content for some creates; return Location header if present
  return { status: res.status, location: res.headers.get('OData-EntityId') || res.headers.get('location') };
}

export async function updateRecord(entitySetName, id, data, { orgUrl } = {}) {
  const token = await authToken();
  const url = `${baseUrl(orgUrl)}/${entitySetName}(${id})`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Dataverse updateRecord failed: ${res.status} ${res.statusText}`);
  return { status: res.status };
}

export async function deleteRecord(entitySetName, id, { orgUrl } = {}) {
  const token = await authToken();
  const url = `${baseUrl(orgUrl)}/${entitySetName}(${id})`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 204) throw new Error(`Dataverse deleteRecord failed: ${res.status} ${res.statusText}`);
  return { status: res.status };
}

export default {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
};
