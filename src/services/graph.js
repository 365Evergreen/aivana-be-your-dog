import { Client } from '@microsoft/microsoft-graph-client';

export function getGraphClient(accessToken) {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
}

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
