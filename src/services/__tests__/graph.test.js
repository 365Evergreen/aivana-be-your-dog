import { fetchGraph } from '../graph';

// Mock microsoft-graph-client
jest.mock('@microsoft/microsoft-graph-client', () => ({
  Client: {
    init: () => ({
      api: () => ({
        get: async () => ({ displayName: 'Test User', mail: 'test@example.com' }),
      }),
    }),
  },
}));

describe('graph.fetchGraph', () => {
  test('fetches endpoint data using provided token', async () => {
    const result = await fetchGraph('/me', 'fake-token');
    expect(result).toHaveProperty('displayName', 'Test User');
  });
});
