import * as _ from 'lodash';

import { ITrack } from '../interfaces/track-interface';

interface IReturn {
  success: boolean;
  track: ITrack;
}

export const getNextTrack = (trackArray: ITrack[], currentTrackId: number): IReturn => {
  if (trackArray.length <= 1)
    return {
      success: false,
      track: null,
    };

  const currentTrackIndex = _.findIndex(trackArray, x => x.id === currentTrackId);
  if (currentTrackIndex === -1)
    return {
      success: false,
      track: null,
    };
  else if (currentTrackIndex === trackArray.length - 1)
    return {
      success: true,
      track: trackArray[0],
    };
  else
    return {
      success: true,
      track: trackArray[currentTrackIndex + 1],
    };
};

export const getPrevTrack = (trackArray: ITrack[], currentTrackId: number): IReturn => {
  if (trackArray.length <= 1)
    return {
      success: false,
      track: null,
    };

  const currentTrackIndex = _.findIndex(trackArray, x => x.id === currentTrackId);
  if (currentTrackIndex === -1)
    return {
      success: false,
      track: null,
    };
  else if (currentTrackIndex === 0)
    return {
      success: true,
      track: trackArray[trackArray.length - 1],
    };
  else
    return {
      success: true,
      track: trackArray[currentTrackIndex - 1],
    };
};
