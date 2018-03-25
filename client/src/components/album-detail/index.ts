import { RouteConfig } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import AlbumService from '../../common/services/albumService';
import Store from '../../common/utils/store';
import { IAlbumResponse } from '../../common/interfaces/album-interface';

interface IParams {
  name: string;
  album: string;
}

@inject(AlbumService, Store)
export class AlbumDetail {
  albumTitle: string = '';
  artistName: string = '';

  albumLoading: boolean = false;

  constructor(private albumService: AlbumService, private store: Store) {}

  fetchAlbumInfo() {
    this.albumLoading = true;

    this.albumService
      .getAlbumInfo(this.albumTitle, this.artistName)
      .then((data: IAlbumResponse) => {
        console.log(data);
      });
  }

  activate(params: IParams, routeConfig: RouteConfig) {
    routeConfig.navModel.setTitle(params.album);

    this.albumTitle = params.album;
    this.artistName = params.name;

    if (this.albumTitle) {
      this.fetchAlbumInfo();
    }
  }

  attached() {
    this.initializeElements();
  }

  initializeElements() {}
}
