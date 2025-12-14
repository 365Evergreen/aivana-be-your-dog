import * as dataverse from '../dataverse';
import * as auth from '../auth';

describe('dataverse service', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  test('queryEntity returns JSON on success', async () => {
    jest.spyOn(auth, 'acquireToken').mockResolvedValue('fake-token');
    const mockJson = { value: [{ id: 1, name: 'a' }] };
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockJson });

    const res = await dataverse.queryEntity('testset', '$top=1');
    expect(res).toEqual(mockJson);
    expect(global.fetch).toHaveBeenCalled();
  });

  test('createRecord throws on non-ok response', async () => {
    jest.spyOn(auth, 'acquireToken').mockResolvedValue('fake-token');
    global.fetch.mockResolvedValueOnce({ ok: false, status: 400, statusText: 'Bad Request' });

    await expect(dataverse.createRecord('testset', { foo: 'bar' })).rejects.toThrow(/Dataverse createRecord failed/);
  });
});
