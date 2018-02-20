import { inject } from 'aurelia-framework';

// @ts-ignore
import * as UIkit from 'uikit';


import TrackService from '../../common/services/trackService';
import { CONTENT_TYPES } from '../../common/utils/constants';

@inject(TrackService)
export class Tracks {
  sliderTracks: HTMLElement;
  topTracksGrid: HTMLElement;

  topTracks = [];

  constructor(private trackService: TrackService) {}

  attached() {
    this.initializeElements();
    this.fetchTopTracks();
  }

  fetchTopTracks() {
    this.trackService
      .getTopTracks(CONTENT_TYPES.USER_CU)
      .then(data => {
        if (data.success) {
          this.topTracks = data.tracks;
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  initializeElements() {
    UIkit.slider(this.sliderTracks, {
      finite: true,
    });
    UIkit.grid(this.topTracksGrid);
  }
}
