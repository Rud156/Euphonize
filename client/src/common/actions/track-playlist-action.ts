import { ITrackBasic } from '../interfaces/track-interface';

export const SELECT_TRACK_FOR_PLAYLIST = 'SELECT_TRACK_FOR_PLAYLIST';

export const selectTrackForPlaylist = (track: ITrackBasic) => {
  return {
    type: SELECT_TRACK_FOR_PLAYLIST,
    payload: {
      track,
    },
  };
};
