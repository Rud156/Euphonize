import { SELECT_TRACK_FOR_PLAYLIST } from '../actions/track-playlist-action';
import { ITrackBasic } from '../interfaces/track-interface';

export interface ITrackPlaylistReducer {
  selectedTrack: ITrackBasic;
}

const defaultState: ITrackPlaylistReducer = {
  selectedTrack: {
    artistName: '',
    trackName: '',
    image: '',
  },
};

export const trackPlaylistReducer = (state = defaultState, action): ITrackPlaylistReducer => {
  switch (action.type) {
    case SELECT_TRACK_FOR_PLAYLIST: {
      return {
        selectedTrack: action.payload.track,
      };
    }

    default:
      return state;
  }
};
