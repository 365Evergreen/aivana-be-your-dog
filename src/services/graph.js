import { Client } from "@microsoft/microsoft-graph-client";

// Returns a Microsoft Graph client wired with the provided access token.
export function getGraphClient(accessToken) {
  return Client.init({
    authProvider: (done) => {
      if (!accessToken) return done(new Error("No access token"), null);
      done(null, accessToken);
    },
  });
}

export async function fetchGraph(endpoint, accessToken) {
  const client = getGraphClient(accessToken);
  return client.api(endpoint).get();
}

// Convenience helpers that accept an already-initialized client
export async function fetchEmails(client, top = 5) {
  const res = await client.api('/me/mailfolders/inbox/messages').top(top).orderby('receivedDateTime DESC').get();
  return res.value;
}

export async function fetchEvents(client, top = 5) {
  const res = await client.api('/me/events').top(top).orderby('start/dateTime DESC').get();
  return res.value;
}

export async function fetchFiles(client, top = 5) {
  const res = await client.api('/me/drive/recent').top(top).get();
  return res.value;
}
