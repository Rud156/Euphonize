import { HttpClient } from 'aurelia-fetch-client';
import { BASE_URL, SELECTION_TYPE, TRACK_DATA } from '../utils/constants';

class TrackService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  getTopTracks = (trackType: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/top_tracks?type=${trackType}`)
      .then(response => response.json());
  };

  getTopTrendingTracks = () => {
    return this.httpClient.fetch(`${BASE_URL}/top_trending`).then(response => response.json());
  };

  getArtistTopTracks = (artistName: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/artist_top?name=${artistName}&type=${SELECTION_TYPE.TRACKS}`)
      .then(response => response.json());
  };

  getTracksForGenre = (genre: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/popular_genre?type=${SELECTION_TYPE.TRACKS}&tag_name=${genre}`)
      .then(response => response.json());
  };

  getTrackInfo = (trackName: string, artistName: string) => {
    return this.httpClient
      .fetch(
        `${BASE_URL}/track?track_name=${trackName}&artist_name=${artistName}&data_type=${
          TRACK_DATA.INFO
        }`
      )
      .then(response => response.json());
  };

  getSimilarTracks = (trackName: string, artistName: string) => {
    return this.httpClient
      .fetch(
        `${BASE_URL}/track?track_name=${trackName}&artist_name=${artistName}&data_type=${
          TRACK_DATA.SIMILAR
        }`
      )
      .then(response => response.json());
  };
}

export default TrackService;
