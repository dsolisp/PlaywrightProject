import axios from 'axios';

export interface SearchResult {
  title: string;
  snippet?: string;
}

export async function fetchSearchResults(query: string): Promise<SearchResult[]> {
  const res = await axios.get('https://api.example.com/search', { params: { q: query } });
  // assume API returns { results: Array<{ title, snippet }> }
  return (res.data && res.data.results) || [];
}
