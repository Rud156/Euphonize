import { HttpClient } from 'aurelia-fetch-client';
import * as _ from 'lodash';
import { SEARCH_BASE_STRING, SEARCH_ENDING_STRING } from '../utils/constants';

class SearchService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  getSearchResults = _.debounce(searchQuery => {
    this.httpClient
      .fetch(`${SEARCH_BASE_STRING}${searchQuery}${SEARCH_ENDING_STRING}`)
      .then(response => response.json());
  }, 250);
}

export default SearchService;
