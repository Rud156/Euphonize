import BaseRequest from './baseRequest';
import { SELECTION_TYPE, TRACK_DATA } from '../utils/constants';

class TrackService extends BaseRequest {
  getTopTracks = (trackType: string, errorMessage?: string) => {
    return this.getDataFromService(`/top_tracks?type=${trackType}`, errorMessage);
  };

  getTopTrendingTracks = (errorMessage?: string) => {
    return this.getDataFromService('/top_trending', errorMessage);
  };

  getArtistTopTracks = (artistName: string, errorMessage?: string) => {
    return this.getDataFromService(
      `/artist_top?name=${artistName}&type=${SELECTION_TYPE.TRACKS}`,
      errorMessage
    );
  };

  getTracksForGenre = (genre: string, errorMessage?: string) => {
    return this.getDataFromService(
      `/popular_genre?type=${SELECTION_TYPE.TRACKS}&tag_name=${genre}`,
      errorMessage
    );
  };

  getTrackInfo = (trackName: string, artistName: string, errorMessage?: string) => {
    return this.getDataFromService(
      `/track?track_name=${trackName}&artist_name=${artistName}&data_type=${TRACK_DATA.INFO}`,
      errorMessage
    );
  };

  getSimilarTracks = (trackName: string, artistName: string, errorMessage?: string) => {
    return this.getDataFromService(
      `/track?track_name=${trackName}&artist_name=${artistName}&data_type=${TRACK_DATA.SIMILAR}`,
      errorMessage
    );
  };
}

export default TrackService;
