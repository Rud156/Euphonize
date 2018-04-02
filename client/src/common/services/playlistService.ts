import BaseRequest from './baseRequest';
import { IPlaylistDictionary } from '../interfaces/playlist-interface';

class PlaylistService extends BaseRequest {
  getPlaylist = (playlistId: string, errorMessage?: string) => {
    return this.getDataFromService(`/get_playlist?playlist_id=${playlistId}`, errorMessage);
  };

  generatePlaylistLink = (playlist: IPlaylistDictionary, errorMessage?: string) => {
    return this.putDataIntoService('/generate_playlist_link', playlist, 'POST', errorMessage);
  };

  updatePlaylist = (playlistId: string, playlist: IPlaylistDictionary, errorMessage?: string) => {
    return this.putDataIntoService(
      `/update_playlist?playlist_id=${playlistId}`,
      playlist,
      'PUT',
      errorMessage
    );
  };
}

export default PlaylistService;
