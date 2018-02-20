import { inject } from 'aurelia-framework';

// @ts-ignore
import * as UIkit from 'uikit';

import TrackService from '../../common/services/trackService';
import { CONTENT_TYPES } from '../../common/utils/constants';

@inject(TrackService)
export class Tracks {
  sliderTracks: HTMLElement;
  topTracks = [];

  constructor(private trackService: TrackService) {}

  attached() {
    UIkit.slider(this.sliderTracks);
    this.fetchTopTracks();
  }

  fetchTopTracks() {
    this.trackService
      .getTopTracks(CONTENT_TYPES.USER_CU)
      .then(data => {
        if (data.success) {
          this.topTracks = data.tracks;
        } else {
          window.alert('Error Occurred');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
}
