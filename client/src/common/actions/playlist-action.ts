export const ADD_TO_PLAYLIST = 'ADD_TO_PLAYLIST';
export const REMOVE_FROM_PLAYLIST = 'REMOVE_FROM_PLAYLIST';
export const SHUFFLE_PLAYLIST = 'SHUFFLE_PLAYLIST';
export const CLEAR_PLAYLIST = 'CLEAR_PLAYLIST';

export const addToPlaylist = (trackName, artistName) => {
  return {
    type: ADD_TO_PLAYLIST,
    payload: {
      trackName,
      artistName,
    },
  };
};

export const removeFromPlaylist = id => {
  return {
    type: REMOVE_FROM_PLAYLIST,
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
