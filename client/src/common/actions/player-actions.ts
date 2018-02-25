export const PLAY_SELECTED_TRACK = 'PLAY_SELECTED_TRACK';

export const playSelectedTrack = (trackName: string, artistName: string, image: string) => {
  return {
    type: PLAY_SELECTED_TRACK,
    payload: {
      trackName,
      artistName,
      image,
    },
  };
};
