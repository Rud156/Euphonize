import { HttpClient } from 'aurelia-fetch-client';
import { BASE_URL, ARTIST_DATA } from '../utils/constants';

class ArtistService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  getTopArtists = (artistType: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/top_artists?type=${artistType}`)
      .then(response => response.json());
  };

  getEmergingArtists = () => {
    return this.httpClient.fetch(`${BASE_URL}/emerging_artists`).then(response => response.json());
  };

  getArtistInfo = (artistName: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/artist?artist_name=${artistName}&data_type=${ARTIST_DATA.INFO}`)
      .then(response => response.json());
  };

  getSimilarArtists = (artistName: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/artist?artist_name=${artistName}&data_type=${ARTIST_DATA.SIMILAR}`)
      .then(response => response.json());
  };
}

export default ArtistService;
