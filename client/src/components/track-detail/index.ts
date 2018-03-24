import { RouteConfig } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import TrackService from '../../common/services/trackService';
import Store from '../../common/utils/store';

interface IParams {
  name: string;
  track: string;
}

@inject(TrackService, Store)
export class TrackDetail {
  trackName: string = '';
  artistName: string = '';

  constructor(private trackService: TrackService, private store: Store) {}

  fetchTrackInfo() {
    this.trackService.getTrackInfo(this.trackName, this.artistName).then(data => {
      console.log(data);
    });
  }

  fetchSimilarTracks() {
    this.trackService.getSimilarTracks(this.trackName, this.artistName).then(data => {
      console.log(data);
    });
  }

  activate(params: IParams, routeConfig: RouteConfig) {
    routeConfig.navModel.setTitle(params.track);

    this.trackName = params.track;
    this.artistName = params.name;

    if (this.trackName) {
      this.fetchTrackInfo();
      this.fetchSimilarTracks();
    }
  }

  attached() {
    this.initializeElements();
  }

  initializeElements() {}
}
