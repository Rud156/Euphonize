import { ITrackBasic } from '../interfaces/track-interface';
import { IPlaylist, IPlaylistDictionary } from '../interfaces/playlist-interface';

export const CREATE_PLAYLIST = 'CREATE_PLAYLIST';
export const REMOVE_PLAYLIST = 'REMOVE_PLAYLIST';
export const ADD_TRACK_TO_PLAYLIST = 'ADD_TRACK_TO_PLAYLIST';
export const ADD_TRACK_TO_MULTIPLE_PLAYLISTS = 'ADD_TRACK_TO_MULTIPLE_PLAYLISTS';
export const REMOVE_TRACK_FROM_PLAYLIST = 'REMOVE_TRACK_FROM_PLAYLIST';
export const DEPLOY_PLAYLISTS = 'DEPLOY_PLAYLISTS';

export const createPlaylist = (playlistName: string) => {
  return {
    type: CREATE_PLAYLIST,
    payload: {
      name: playlistName,
    },
  };
};

export const removePlaylist = (playlistName: string) => {
  return {
    type: REMOVE_PLAYLIST,
    payload: {
      name: playlistName,
    },
  };
};

export const addTrackToPlaylist = (track: ITrackBasic, playlistName: string) => {
  return {
    type: ADD_TRACK_TO_PLAYLIST,
    payload: {
      track,
      name: playlistName,
    },
  };
};

export const addTrackToMultiplePlaylists = (track: ITrackBasic, playlists: string[]) => {
  return {
    type: ADD_TRACK_TO_MULTIPLE_PLAYLISTS,
    payload: {
      track,
      playlists,
    },
  };
};

export const removeTrackFromPlaylist = (track: ITrackBasic, playlistName: string) => {
  return {
    type: REMOVE_TRACK_FROM_PLAYLIST,
    payload: {
      track,
      name: playlistName,
    },
  };
};

export const deployPlaylists = (playlists: IPlaylistDictionary) => {
  return {
    type: DEPLOY_PLAYLISTS,
    payload: {
      playlists,
    },
  };
};
