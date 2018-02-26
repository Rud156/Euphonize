import { ITrack, ITrackBasic } from '../interfaces/track-interface';

export const ADD_TO_NOW_PLAYING = 'ADD_TO_NOW_PLAYING';
export const REMOVE_FROM_NOW_PLAYING = 'REMOVE_FROM_NOW_PLAYING';
export const SHUFFLE_NOW_PLAYING = 'SHUFFLE_NOW_PLAYING';
export const ADD_PLAYLIST_TO_NOW_PLAYING = 'ADD_PLAYLIST_TO_NOW_PLAYING';

export const PLAY_NEXT_TRACK_FROM_NOW_PLAYING = 'PLAY_NEXT_TRACK_FROM_NOW_PLAYING';
export const PLAY_PREV_TRACK_FROM_NOW_PLAYING = 'PLAY_PREV_TRACK_FROM_NOW_PLAYING';

export const addToNowPlaying = (trackName: string, artistName: string, image: string) => {
  return {
    type: ADD_TO_NOW_PLAYING,
    payload: {
      trackName,
      artistName,
      image,
    },
  };
};

export const removeFromNowPlaying = (id: number) => {
  return {
    type: REMOVE_FROM_NOW_PLAYING,
    payload: {
      id,
    },
  };
};

export const shuffleNowPlaying = () => {
  return {
    type: SHUFFLE_NOW_PLAYING,
    payload: {},
  };
};

export const addPlayListToNowPlaying = (tracks: ITrack[]) => {
  return {
    type: ADD_PLAYLIST_TO_NOW_PLAYING,
    payload: {
      tracks,
    },
  };
};
