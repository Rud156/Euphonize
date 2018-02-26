import { PLAY_SELECTED_TRACK } from '../actions/player-actions';
import { TRACK_IMAGE_PLACEHOLDER } from '../utils/constants';
import { ITrackBasic } from '../interfaces/track-interface';

export interface IPlayerReducer {
  currentTrack: ITrackBasic;
}

const defaultState: IPlayerReducer = {
  currentTrack: {
    trackName: '',
    artistName: '',
    image: TRACK_IMAGE_PLACEHOLDER,
  },
};

export const playerReducer = (state = defaultState, action): IPlayerReducer => {
  switch (action.type) {
    case PLAY_SELECTED_TRACK:
      const currentTrack = state.currentTrack;
      currentTrack.trackName = action.payload.trackName;
      currentTrack.artistName = action.payload.artistName;
      currentTrack.image = action.payload.image;
      return {
        ...state,
        currentTrack,
      };

    default:
      return state;
  }
};
