import { HttpClient } from 'aurelia-fetch-client';
import * as _ from 'lodash';
import { SEARCH_BASE_STRING, SEARCH_ENDING_STRING } from '../utils/constants';

class SearchService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  getSearchResults = (searchQuery: string) => {
    return this.httpClient
      .fetch(`${SEARCH_BASE_STRING}${searchQuery}${SEARCH_ENDING_STRING}`)
      .then(response => response.json());
  };
}

export default SearchService;
