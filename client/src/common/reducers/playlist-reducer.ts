import {
  CREATE_PLAYLIST,
  REMOVE_PLAYLIST,
  ADD_TRACK_TO_PLAYLIST,
  ADD_TRACK_TO_MULTIPLE_PLAYLISTS,
  REMOVE_TRACK_FROM_PLAYLIST,
  DEPLOY_PLAYLISTS,
} from '../actions/playlist-actions';
import { writeToLocalStorage } from '../utils/utils';

import { IPlaylist, IPlaylistDictionary } from '../interfaces/playlist-interface';
import { ITrackBasic } from '../interfaces/track-interface';
import { PLAYLIST_LOCAL_STORAGE } from '../utils/constants';

export interface IPlaylistReducer {
  playlists: IPlaylistDictionary;
}

const defaultState: IPlaylistReducer = {
  playlists: {},
};

export const playlistReducer = (state = defaultState, action): IPlaylistReducer => {
  switch (action.type) {
    case CREATE_PLAYLIST: {
      const currentPlaylists = state.playlists;
      const playlistName: string = action.payload.name;

      if (playlistName in currentPlaylists) {
        return state;
      } else {
        currentPlaylists[playlistName] = [];
        writeToLocalStorage(PLAYLIST_LOCAL_STORAGE, currentPlaylists);
        return {
          playlists: currentPlaylists,
        };
      }
    }

    case REMOVE_PLAYLIST: {
      const playlistToRemoveName: string = action.payload.name;
      const currentPlaylists = state.playlists;

      delete currentPlaylists[playlistToRemoveName];

      writeToLocalStorage(PLAYLIST_LOCAL_STORAGE, currentPlaylists);
      return {
        playlists: currentPlaylists,
      };
    }

    case ADD_TRACK_TO_PLAYLIST: {
      const playlistName: string = action.payload.name;
      const currentPlaylists = state.playlists;

      if (playlistName in currentPlaylists) {
        const track: ITrackBasic = action.payload.track;
        const currentTracks = currentPlaylists[playlistName];
        const index = currentTracks.findIndex(
          _ => _.trackName === track.trackName && _.artistName === track.artistName
        );

        if (index === -1) {
          currentPlaylists[playlistName].push(action.payload.track);
          writeToLocalStorage(PLAYLIST_LOCAL_STORAGE, currentPlaylists);
          return {
            playlists: currentPlaylists,
          };
        } else {
          return state;
        }
      } else {
        return state;
      }
    }

    case ADD_TRACK_TO_MULTIPLE_PLAYLISTS: {
      const playlists: string[] = action.payload.playlists;
      const track: ITrackBasic = action.payload.track;
      const currentPlaylists = state.playlists;

      playlists.forEach(element => {
        if (element in currentPlaylists) {
          const index = currentPlaylists[element].findIndex(
            _ => _.trackName === track.trackName && _.artistName === track.artistName
          );
          if (index === -1) currentPlaylists[element].push(track);
        }
      });

      writeToLocalStorage(PLAYLIST_LOCAL_STORAGE, currentPlaylists);
      return {
        playlists: currentPlaylists,
      };
    }

    case REMOVE_TRACK_FROM_PLAYLIST: {
      const playlistName: string = action.payload.name;
      const currentPlaylists = state.playlists;
      const trackToRemove: ITrackBasic = action.payload.track;

      if (playlistName in currentPlaylists) {
        const filteredTracks: ITrackBasic[] = currentPlaylists[playlistName].filter(element => {
          return (
            element.trackName !== trackToRemove.trackName ||
            element.artistName !== trackToRemove.artistName
          );
        });

        currentPlaylists[playlistName] = filteredTracks;
        writeToLocalStorage(PLAYLIST_LOCAL_STORAGE, currentPlaylists);
        return {
          playlists: currentPlaylists,
        };
      } else {
        return state;
      }
    }

    case DEPLOY_PLAYLISTS: {
      const playlists: IPlaylistDictionary = action.payload.playlists;
      writeToLocalStorage(PLAYLIST_LOCAL_STORAGE, playlists);
      return {
        playlists,
      };
    }

    default:
      return state;
  }
};
