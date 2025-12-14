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
