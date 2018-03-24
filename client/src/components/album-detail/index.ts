import { RouteConfig } from 'aurelia-router';

interface IParams {
  name: string;
  album: string;
}

export class AlbumDetail {
  albumTitle: string = '';
  artistName: string = '';

  constructor() {}

  activate(params: IParams, routeConfig: RouteConfig) {
    routeConfig.navModel.setTitle(params.album);

    this.albumTitle = params.album;
    this.artistName = params.name;

    if (this.albumTitle) {
    }
  }

  attached() {
    this.initializeElements();
  }

  initializeElements() {}
}
