import axios from 'axios';
import { fetchSearchResults } from '../../api/search_api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchSearchResults', () => {
  it('returns results from the API', async () => {
    mockedAxios.get.mockResolvedValue({ data: { results: [{ title: 'r1' }, { title: 'r2' }] } });
    const res = await fetchSearchResults('playwright');
    expect(res).toHaveLength(2);
    expect(res[0].title).toBe('r1');
  });

  it('returns empty array on unexpected response', async () => {
    mockedAxios.get.mockResolvedValue({ data: {} });
    const res = await fetchSearchResults('none');
    expect(res).toEqual([]);
  });
});
