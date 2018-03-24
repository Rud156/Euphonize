import { HttpClient } from 'aurelia-fetch-client';
import { BASE_URL, SELECTION_TYPE } from '../utils/constants';

class AlbumService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  getTopAlbums = () => {
    return this.httpClient.fetch(`${BASE_URL}/top_albums`).then(response => response.json());
  };

  getArtistTopAlbums = (artistName: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/artist_top?name=${artistName}&type=${SELECTION_TYPE.ALBUMS}`)
      .then(response => response.json());
  };

  getAlbumsForGenre = (genre: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/popular_genre?type=${SELECTION_TYPE.ALBUMS}&tag_name=${genre}`)
      .then(response => response.json());
  };

  getAlbumInfo = (albumName: string, artistName: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/album_info?album_name=${albumName}&artist_name=${artistName}`)
      .then(response => response.json());
  };
}

export default AlbumService;
