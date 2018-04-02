import BaseRequest from './baseRequest';
import { SELECTION_TYPE } from '../utils/constants';

class AlbumService extends BaseRequest {
  getTopAlbums = (errorMessage?: string) => {
    return this.getDataFromService('/top_albums', errorMessage);
  };

  getArtistTopAlbums = (artistName: string, errorMessage?: string) => {
    return this.getDataFromService(
      `/artist_top?name=${artistName}&type=${SELECTION_TYPE.ALBUMS}`,
      errorMessage
    );
  };

  getAlbumsForGenre = (genre: string, errorMessage?: string) => {
    return this.getDataFromService(
      `/popular_genre?type=${SELECTION_TYPE.ALBUMS}&tag_name=${genre}`,
      errorMessage
    );
  };

  getAlbumInfo = (albumName: string, artistName: string, errorMessage?: string) => {
    return this.getDataFromService(
      `/album_info?album_name=${albumName}&artist_name=${artistName}`,
      errorMessage
    );
  };
}

export default AlbumService;
