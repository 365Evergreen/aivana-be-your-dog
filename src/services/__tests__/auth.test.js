import { acquireToken } from '../auth';

jest.mock('../msalInstance', () => ({
  msalInstance: {
    getAllAccounts: () => [{ username: 'test' }],
    acquireTokenSilent: jest.fn(),
    acquireTokenPopup: jest.fn(),
  },
}));

describe('auth.acquireToken', () => {
  afterEach(() => jest.resetAllMocks());

  test('returns token from acquireTokenSilent when available', async () => {
    const { msalInstance } = require('../msalInstance');
    msalInstance.acquireTokenSilent.mockResolvedValue({ accessToken: 'silent-token' });

    const token = await acquireToken();
    expect(token).toBe('silent-token');
  });

  test('falls back to acquireTokenPopup when silent fails', async () => {
    const { msalInstance } = require('../msalInstance');
    msalInstance.acquireTokenSilent.mockRejectedValue(new Error('no-silent'));
    msalInstance.acquireTokenPopup.mockResolvedValue({ accessToken: 'popup-token' });

    const token = await acquireToken();
    expect(token).toBe('popup-token');
  });
});
