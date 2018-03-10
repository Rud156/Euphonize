import {
  ADD_TO_NOW_PLAYING,
  REMOVE_FROM_NOW_PLAYING,
  SHUFFLE_NOW_PLAYING,
  ADD_PLAYLIST_TO_NOW_PLAYING,
  PLAY_NEXT_TRACK_FROM_NOW_PLAYING,
  PLAY_PREV_TRACK_FROM_NOW_PLAYING,
} from '../actions/now-playing-actions';
import { ITrack, ITrackBasic } from '../interfaces/track-interface';

export interface INowPlayingReducer {
  tracks: ITrack[];
  id: number;
  name: string;
}

const defaultState: INowPlayingReducer = {
  tracks: [],
  id: 0,
  name: '',
};

export const nowPlayingReducer = (state = defaultState, action): INowPlayingReducer => {
  switch (action.type) {
    case ADD_TO_NOW_PLAYING: {
      const currentNowPlayingList = { ...state };

      const {
        trackName,
        artistName,
        image,
      }: { trackName: string; artistName: string; image: string } = action.payload;

      const index = state.tracks.findIndex(
        _ => _.trackName === trackName && _.artistName === artistName
      );
      if (index === -1) {
        currentNowPlayingList.id += 1;

        currentNowPlayingList.tracks.push({
          trackName: action.payload.trackName,
          artistName: action.payload.artistName,
          image: action.payload.image,
          id: state.id + 1,
        });
      }

      return currentNowPlayingList;
    }

    case REMOVE_FROM_NOW_PLAYING: {
      let trackId = action.payload.id;

      let filteredTracks = state.tracks.filter(element => element.id !== trackId);

      const filteredNowPlaying = {
        id: state.id,
        tracks: filteredTracks,
        name: '',
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
        name: state.name,
      };
      return shuffledNowPlaying;
    }

    case ADD_PLAYLIST_TO_NOW_PLAYING: {
      const tracks: ITrackBasic[] = action.payload.tracks;
      const playlistName: string = action.payload.name;
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
        name: playlistName,
      };
    }

    default:
      return state;
  }
};
