import {
  ADD_TO_NOW_PLAYING,
  REMOVE_FROM_NOW_PLAYING,
  SHUFFLE_NOW_PLAYING,
  ADD_PLAYLIST_TO_NOW_PLAYING,
} from '../actions/now-playing-actions';
import { ITrack, ITrackBasic } from '../interfaces/track-interface';

export interface INowPlayingReducer {
  tracks: ITrack[];
  id: number;
}

const defaultState: INowPlayingReducer = {
  tracks: [],
  id: 0,
};

export const nowPlayingReducer = (state = defaultState, action): INowPlayingReducer => {
  switch (action.type) {
    case ADD_TO_NOW_PLAYING: {
      const currentNowPlayingList = { ...state };

      currentNowPlayingList.id += 1;

      currentNowPlayingList.tracks.push({
        trackName: action.payload.trackName,
        artistName: action.payload.artistName,
        image: action.payload.image,
        id: state.id + 1,
      });

      return currentNowPlayingList;
    }

    case REMOVE_FROM_NOW_PLAYING: {
      let trackId = action.payload.id;

      let filteredTracks = state.tracks.filter(element => element.id !== trackId);

      const filteredNowPlaying = {
        id: state.id,
        tracks: filteredTracks,
      };

      return filteredNowPlaying;
    }

    case SHUFFLE_NOW_PLAYING: {
      let currentTracks = state.tracks;
      if (currentTracks.length == 0 || currentTracks.length == 1) return state;

      let currentIndex = currentTracks.length;
      let tempVal, randomIndex;

      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        tempVal = currentTracks[currentIndex];
        currentTracks[currentIndex] = currentTracks[randomIndex];
        currentTracks[randomIndex] = tempVal;
      }
      const shuffledNowPlaying = {
        id: state.id,
        tracks: currentTracks,
      };
      return shuffledNowPlaying;
    }

    case ADD_PLAYLIST_TO_NOW_PLAYING: {
      const tracks: ITrackBasic[] = action.payload.tracks;
      const modifiedTracks: ITrack[] = tracks.map((element, index) => {
        return {
          ...element,
          id: index,
        };
      });
      const totalTracks = tracks.length;
      
      return {
        tracks: modifiedTracks,
        id: modifiedTracks.length,
      };
    }

    default:
      return state;
  }
};
