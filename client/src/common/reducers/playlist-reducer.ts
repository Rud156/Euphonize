import {
  ADD_TO_PLAYLIST,
  PLAY_NEXT_TRACK,
  PLAY_PREV_TRACK,
  REMOVE_FROM_PLAYLIST,
  CLEAR_PLAYLIST,
  SHUFFLE_PLAYLIST,
} from '../actions/playlist-action';

interface ITracks {
  trackName: string;
  artistName: string;
  id: number;
}

export interface IPlaylistReducer {
  tracks: ITracks[];
  id: number;
}

const defaultState: IPlaylistReducer = {
  tracks: [],
  id: 0,
};

const writeStateToLocalStorage = (playlist: IPlaylistReducer) => {
  window.localStorage.setItem('playlist', JSON.stringify(playlist));
};

export const playlistReducer = (state = defaultState, action): IPlaylistReducer => {
  switch (action.type) {
    case ADD_TO_PLAYLIST:
      const currentPlaylist = { ...state };
      currentPlaylist.id += 1;
      currentPlaylist.tracks.push({
        trackName: action.payload.trackName,
        artistName: action.payload.artistName,
        id: state.id + 1,
      });
      writeStateToLocalStorage(currentPlaylist);
      return currentPlaylist;

    case PLAY_NEXT_TRACK:
      break;

    case PLAY_PREV_TRACK:
      break;

    case REMOVE_FROM_PLAYLIST:
      let trackId = action.payload.id;
      let filteredTracks = state.tracks.filter(element => element.id !== trackId);
      const filteredPlaylist = {
        id: state.id,
        tracks: filteredTracks,
      };
      writeStateToLocalStorage(filteredPlaylist);
      return filteredPlaylist;

    case CLEAR_PLAYLIST:
      const clearedPlaylist = {
        id: 0,
        tracks: [],
      };
      writeStateToLocalStorage(clearedPlaylist);
      return clearedPlaylist;

    case SHUFFLE_PLAYLIST:
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
      const shuffledPlaylist = {
        id: state.id,
        tracks: currentTracks,
      };
      writeStateToLocalStorage(shuffledPlaylist);
      return shuffledPlaylist;

    default:
      return state;
  }
};
