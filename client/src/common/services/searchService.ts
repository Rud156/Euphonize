import { HttpClient } from 'aurelia-fetch-client';
import { BASE_URL } from '../utils/constants';

class SearchService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  getSearchResults = (searchQuery: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/search?search_query=${searchQuery}`)
      .then(response => response.json());
  };
}

export default SearchService;
