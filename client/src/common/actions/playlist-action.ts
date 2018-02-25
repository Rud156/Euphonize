export const ADD_TO_PLAYLIST = 'ADD_TO_PLAYLIST';
export const PLAY_NEXT_TRACK = 'PLAY_NEXT_TRACK';
export const PLAY_PREV_TRACK = 'PLAY_PREV_TRACK';
export const REMOVE_FROM_PLAYLIST = 'REMOVE_FROM_PLAYLIST';
export const SHUFFLE_PLAYLIST = 'SHUFFLE_PLAYLIST';
export const CLEAR_PLAYLIST = 'CLEAR_PLAYLIST';

export const addToPlaylist = (trackName: string, artistName: string) => {
  return {
    type: ADD_TO_PLAYLIST,
    payload: {
      trackName,
      artistName,
    },
  };
};

export const removeFromPlaylist = (id: number) => {
  return {
    type: REMOVE_FROM_PLAYLIST,
    payload: {
      id,
    },
  };
};

export const playNextTrack = (id: number) => {
  return {
    type: PLAY_NEXT_TRACK,
    payload: {
      id,
    },
  };
};

export const playPrevTrack = (id: number) => {
  return {
    type: PLAY_PREV_TRACK,
    payload: {
      id,
    },
  };
};

export const shufflePlaylist = () => {
  return {
    type: SHUFFLE_PLAYLIST,
    payload: {},
  };
};

export const clearPlaylist = () => {
  return {
    type: CLEAR_PLAYLIST,
    payload: {},
  };
};
