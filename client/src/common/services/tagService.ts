import { HttpClient } from 'aurelia-fetch-client';
import { BASE_URL, SELECTION_TYPE } from '../utils/constants';

class TagService {
  httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  getTopTags = () => {
    return this.httpClient
      .fetch(`${BASE_URL}/popular_genre?type=${SELECTION_TYPE.TAGS}`)
      .then(response => response.json());
  };
}

export default TagService;
