import BaseRequest from './baseRequest';
import { ARTIST_DATA } from '../utils/constants';

class ArtistService extends BaseRequest {
  getTopArtists = (artistType: string, errorMessage?: string) => {
    return this.getDataFromService(`/top_artists?type=${artistType}`, errorMessage);
  };

  getEmergingArtists = () => {
    return this.getDataFromService('/emerging_artists');
  };

  getArtistInfo = (artistName: string, errorMessage?: string) => {
    return this.getDataFromService(
      `/artist?artist_name=${artistName}&data_type=${ARTIST_DATA.INFO}`,
      errorMessage
    );
  };

  getSimilarArtists = (artistName: string, errorMessage?: string) => {
    return this.getDataFromService(
      `/artist?artist_name=${artistName}&data_type=${ARTIST_DATA.SIMILAR}`,
      errorMessage
    );
  };
}

export default ArtistService;
