import BaseRequest from './baseRequest';
import { SELECTION_TYPE } from '../utils/constants';

class GenreService extends BaseRequest {
  getTopGenres = (errorMessage?: string) => {
    return this.getDataFromService(`/popular_genre?type=${SELECTION_TYPE.TAGS}`, errorMessage);
  };
}

export default GenreService;
