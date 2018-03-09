import { inject } from 'aurelia-framework';
import { RouteConfig, Router } from 'aurelia-router';

// @ts-ignore
import * as UIkit from 'uikit';

import Store from '../../common/utils/store';
import { IPlaylist } from '../../common/interfaces/playlist-interface';

interface IParams {
  id: string;
}

@inject(Store, Router)
export class LibraryDetail {
  detailGrid: HTMLElement;

  playlistName: string = '';
  currentPlaylist: IPlaylist = {
    name: '',
    tracks: [],
  };

  constructor(private store: Store, private router: Router) {}

  handleRouteAttachment() {
    const currentPlaylists = this.store.dataStore.getState().playlist.playlists;
    if (!(this.playlistName in currentPlaylists)) {
      this.router.navigateToRoute('library');
    }

    this.currentPlaylist = {
      name: this.playlistName,
      tracks: currentPlaylists[this.playlistName],
    };
  }

  removeTrackFromPlaylist(trackName, artistName, image) {
    console.log(arguments);
  }

  activate(params: IParams, routeConfig: RouteConfig) {
    routeConfig.navModel.setTitle(params.id);
    this.playlistName = params.id;

    this.handleRouteAttachment();
  }

  attached() {
    this.initializeElements();
  }

  initializeElements() {
    UIkit.grid(this.detailGrid);
  }
}
