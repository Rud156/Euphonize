import { RouteConfig } from 'aurelia-router';

interface IParams {
  name: string;
  track: string;
}

export class TrackDetail {
  trackName: string = '';
  artistName: string = '';

  constructor() {}

  activate(params: IParams, routeConfig: RouteConfig) {
    routeConfig.navModel.setTitle(params.track);

    this.trackName = params.track;
    this.artistName = params.name;

    if (this.trackName) {
    }
  }

  attached() {
    this.initializeElements();
  }

  initializeElements() {}
}
