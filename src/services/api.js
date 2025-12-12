import { acquireToken } from './auth';
import { fetchGraph } from './graph';

// Service helpers that call Microsoft Graph. Keep these small and focused.
export async function getMe() {
  const token = await acquireToken();
  return fetchGraph('/me', token);
}

export async function fetchData() {
  // kept for backward compatibility; returns profile by default
  return getMe();
}

