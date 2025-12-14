import * as sharepoint from '../sharepoint';
import * as auth from '../auth';

describe('sharepoint service', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  test('getListItems returns json on success', async () => {
    jest.spyOn(auth, 'acquireToken').mockResolvedValue('fake-token');
    const mockJson = { value: [{ id: '1' }] };
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockJson });

    const res = await sharepoint.getListItems('site1', 'list1');
    expect(res).toEqual(mockJson);
    expect(global.fetch).toHaveBeenCalled();
  });

  test('uploadFileToDrive throws when driveId missing', async () => {
    await expect(sharepoint.uploadFileToDrive('', '/file.txt', new Blob(['x']))).rejects.toThrow(/driveId is required/);
  });
});
