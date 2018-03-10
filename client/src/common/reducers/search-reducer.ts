import { ITrackBasic } from '../interfaces/track-interface';

import { UPDATE_SEARCH_RESULTS } from '../actions/search-actions';

export interface ISearchReducer {
  tracks: ITrackBasic[];
  searchQuery: string;
}

const defaultState: ISearchReducer = {
  tracks: [],
  searchQuery: '',
};

export const searchReducer = (state = defaultState, action): ISearchReducer => {
  switch (action.type) {
    case UPDATE_SEARCH_RESULTS: {
      const tracks: ITrackBasic[] = action.payload.tracks;
      const searchQuery: string = action.payload.searchQuery;

      return {
        tracks,
        searchQuery,
      };
    }

    default:
      return state;
  }
};
