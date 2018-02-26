import {
  CREATE_PLAYLIST,
  REMOVE_PLAYLIST,
  ADD_TRACK_TO_PLAYLIST,
  REMOVE_TRACK_FROM_PLAYLIST,
  DEPLOY_PLAYLISTS,
} from '../actions/playlist-actions';
import { writeToLocalStorage } from '../utils/utils';

import { IPlaylist } from '../interfaces/playlist-interface';
import { ITrackBasic } from '../interfaces/track-interface';
import { PLAYLIST_LOCAL_STORAGE } from '../utils/constants';

export interface IPlaylistReducer {
  playlists: IPlaylist[];
}

const defaultState: IPlaylistReducer = {
  playlists: [],
};

export const playlistReducer = (state = defaultState, action): IPlaylistReducer => {
  switch (action.type) {
    case CREATE_PLAYLIST: {
      const currentPlaylists = state.playlists;
      const playlistName: string = action.payload.name;
      const playlistIndex = currentPlaylists.findIndex(_ => _.name === playlistName);

      if (playlistIndex !== -1) return state;
      else {
        currentPlaylists.push({
          name: playlistName,
          tracks: [],
        });

        writeToLocalStorage(PLAYLIST_LOCAL_STORAGE, currentPlaylists);
        return {
          playlists: currentPlaylists,
        };
      }
    }

    case REMOVE_PLAYLIST: {
      const playlistToRemoveName: string = action.payload.name;
      const currentPlaylists = state.playlists;

      const filteredPlaylists = currentPlaylists.filter(element => {
        element.name !== playlistToRemoveName;
      });

      writeToLocalStorage(PLAYLIST_LOCAL_STORAGE, filteredPlaylists);
      return {
        playlists: filteredPlaylists,
      };
    }

    case ADD_TRACK_TO_PLAYLIST: {
      const playlistName: string = action.payload.name;
      const currentPlaylists = state.playlists;
      const playlistIndex = currentPlaylists.findIndex(_ => _.name === playlistName);

      if (playlistIndex === -1) return state;
      else {
        currentPlaylists[playlistIndex].tracks.push(action.payload.track);

        writeToLocalStorage(PLAYLIST_LOCAL_STORAGE, currentPlaylists);
        return {
          playlists: currentPlaylists,
        };
      }
    }

    case REMOVE_TRACK_FROM_PLAYLIST: {
      const playlistName: string = action.payload.name;
      const currentPlaylists = state.playlists;
      const trackToRemove: ITrackBasic = action.payload.track;
      const playlistIndex = currentPlaylists.findIndex(_ => _.name === playlistName);

      if (playlistIndex === -1) return state;
      else {
        const filteredTracks: ITrackBasic[] = currentPlaylists[playlistIndex].tracks.filter(
          element => {
            return (
              element.trackName !== trackToRemove.trackName &&
              element.image !== trackToRemove.image &&
              element.artistName !== trackToRemove.artistName
            );
          }
        );

        currentPlaylists[playlistIndex].tracks = filteredTracks;

        writeToLocalStorage(PLAYLIST_LOCAL_STORAGE, currentPlaylists);
        return {
          playlists: currentPlaylists,
        };
      }
    }

    case DEPLOY_PLAYLISTS: {
      return {
        playlists: action.payload.playlists,
      };
    }

    default:
      return state;
  }
};
