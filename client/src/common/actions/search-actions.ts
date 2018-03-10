import { ITrackBasic } from '../interfaces/track-interface';

export const UPDATE_SEARCH_RESULTS = 'UPDATE_SEARCH_RESULTS';

export const updateSearchResults = (tracks: ITrackBasic[], searchQuery: string) => {
  return {
    type: UPDATE_SEARCH_RESULTS,
    payload: {
      tracks,
      searchQuery,
    },
  };
};
