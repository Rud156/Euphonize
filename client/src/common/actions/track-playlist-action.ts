import { ITrackBasic } from '../interfaces/track-interface';

export const SELECT_TRACK_FOR_PLAYLIST = 'SELECT_TRACK_FOR_PLAYLIST';
export const REMOVE_SELECTED_TRACK = 'REMOVE_SELECTED_TRACK';

export const selectTrackForPlaylist = (track: ITrackBasic) => {
  return {
    type: SELECT_TRACK_FOR_PLAYLIST,
    payload: {
      track,
    },
  };
};

export const removeSelectedTrack = () => {
  return {
    type: REMOVE_SELECTED_TRACK,
    payload: {},
  };
};
