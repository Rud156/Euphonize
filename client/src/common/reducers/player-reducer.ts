import { PLAY_SELECTED_TRACK } from '../actions/player-actions';
import { TRACK_IMAGE_PLACEHOLDER } from '../utils/constants';

export interface ITrackInterface {
  trackName: string;
  artistName: string;
  image: string;
}

export interface IPlayerReducer {
  currentTrack: ITrackInterface;
}

const defaultState: IPlayerReducer = {
  currentTrack: {
    trackName: '',
    artistName: '',
    image: TRACK_IMAGE_PLACEHOLDER,
  },
};

export const playerReducer = (state = defaultState, action) => {
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
