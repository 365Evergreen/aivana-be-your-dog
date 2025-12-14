import { Client } from "@microsoft/microsoft-graph-client";
import { acquireToken } from "./auth";

// Returns a Microsoft Graph client wired with the provided access token.
export function getGraphClient(accessToken) {
  return Client.init({
    authProvider: (done) => {
      if (!accessToken) return done(new Error("No access token"), null);
      done(null, accessToken);
    },
  });
}

// Acquire token for the given scopes and return an authenticated client.
export async function getGraphClientForScopes(scopes = ["User.Read"]) {
  const token = await acquireToken(scopes);
  if (!token) throw new Error("Could not acquire access token for Graph");
  return getGraphClient(token);
}

export async function fetchGraph(endpoint, accessToken) {
  const client = getGraphClient(accessToken);
  return client.api(endpoint).get();
}

// Convenience helpers that accept an already-initialized client or will acquire a client.
export async function fetchEmails(clientOrScopes, top = 5) {
  const client = typeof clientOrScopes === 'object' && clientOrScopes.api ? clientOrScopes : await getGraphClientForScopes(clientOrScopes || ["Mail.Read"]);
  const res = await client.api('/me/mailfolders/inbox/messages').top(top).orderby('receivedDateTime DESC').get();
  return res.value;
}

export async function fetchEvents(clientOrScopes, top = 5) {
  const client = typeof clientOrScopes === 'object' && clientOrScopes.api ? clientOrScopes : await getGraphClientForScopes(clientOrScopes || ["Calendars.Read"]);
  const res = await client.api('/me/events').top(top).orderby('start/dateTime DESC').get();
  return res.value;
}

export async function fetchFiles(clientOrScopes, top = 5) {
  const client = typeof clientOrScopes === 'object' && clientOrScopes.api ? clientOrScopes : await getGraphClientForScopes(clientOrScopes || ["Files.Read"]);
  const res = await client.api('/me/drive/recent').top(top).get();
  return res.value;
}

// Planner helpers
export async function fetchPlannerPlansForUser(clientOrScopes) {
  const client = typeof clientOrScopes === 'object' && clientOrScopes.api ? clientOrScopes : await getGraphClientForScopes(clientOrScopes || ["Group.Read.All"]);
  // GET /me/planner/plans isn't available; list plans via joined groups: fetch user's joined groups then plans per group
  const groups = await client.api('/me/memberOf').select('id,displayName').get();
  const groupIds = ((groups && groups.value) || []).map(g => g.id).slice(0, 20);
  const plans = [];
  for (const gid of groupIds) {
    try {
      const res = await client.api(`/groups/${gid}/planner/plans`).get();
      if (res && Array.isArray(res.value)) plans.push(...res.value);
    } catch (e) {
      // ignore groups without planner or permissions
    }
  }
  return plans;
}

export async function fetchPlannerTasksForUser(clientOrScopes) {
  const client = typeof clientOrScopes === 'object' && clientOrScopes.api ? clientOrScopes : await getGraphClientForScopes(clientOrScopes || ["Group.Read.All"]);
  const res = await client.api('/me/planner/tasks').get();
  return (res && res.value) || [];
}

export async function fetchPlanTasks(planId, clientOrScopes) {
  if (!planId) throw new Error('planId is required');
  const client = typeof clientOrScopes === 'object' && clientOrScopes.api ? clientOrScopes : await getGraphClientForScopes(clientOrScopes || ["Group.Read.All"]);
  const res = await client.api(`/planner/plans/${planId}/tasks`).get();
  return (res && res.value) || [];
}

export async function createPlannerTask({ title, planId, bucketId, assignments = {} }, clientOrScopes) {
  if (!title || !planId || !bucketId) throw new Error('title, planId and bucketId are required to create a planner task');
  const client = typeof clientOrScopes === 'object' && clientOrScopes.api ? clientOrScopes : await getGraphClientForScopes(clientOrScopes || ["Group.ReadWrite.All"]);
  const body = { title, planId, bucketId, assignments };
  const res = await client.api('/planner/tasks').post(body);
  return res;
}

export async function updatePlannerTask(taskId, patch, clientOrScopes) {
  if (!taskId) throw new Error('taskId is required');
  const client = typeof clientOrScopes === 'object' && clientOrScopes.api ? clientOrScopes : await getGraphClientForScopes(clientOrScopes || ["Group.ReadWrite.All"]);
  // Graph PATCH requires If-Match header with ETag; a simplified approach is to fetch the task, get etag
  const existing = await client.api(`/planner/tasks/${taskId}`).get();
  const etag = existing['@odata.etag'] || '*';
  const res = await client.api(`/planner/tasks/${taskId}`).header('If-Match', etag).patch(patch);
  return res;
}
