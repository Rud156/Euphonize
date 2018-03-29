import { HttpClient } from 'aurelia-fetch-client';
import { BASE_URL } from '../utils/constants';
import { IPlaylistDictionary } from '../interfaces/playlist-interface';

class PlaylistService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  getPlaylist = (playlistId: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/get_playlist?playlist_id=${playlistId}`)
      .then(response => response.json());
  };

  generatePlaylistLink = (playlist: IPlaylistDictionary) => {
    return this.httpClient
      .fetch(`${BASE_URL}/generate_playlist_link`, {
        body: JSON.stringify(playlist),
        method: 'POST',
      })
      .then(response => response.json());
  };

  updatePlaylist = (playlistId: string, playlist: IPlaylistDictionary) => {
    return this.httpClient
      .fetch(`${BASE_URL}/update_playlist?playlist_id=${playlistId}`, {
        body: JSON.stringify(playlist),
        method: 'PUT',
      })
      .then(response => response.json());
  };
}

export default PlaylistService;
