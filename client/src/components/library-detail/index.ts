import { inject } from 'aurelia-framework';
import { RouteConfig, Router } from 'aurelia-router';
import { Unsubscribe } from 'redux';

// @ts-ignore
import * as UIkit from 'uikit';

import Store from '../../common/utils/store';
import { IPlaylist } from '../../common/interfaces/playlist-interface';
import { removeTrackFromPlaylist, removePlaylist } from '../../common/actions/playlist-actions';
import { addPlayListToNowPlaying } from '../../common/actions/now-playing-actions';
import { playSelectedTrack } from '../../common/actions/player-actions';

interface IParams {
  id: string;
}

@inject(Store, Router)
export class LibraryDetail {
  detailGrid: HTMLElement;
  reduxSubscription: Unsubscribe;

  playlistName: string = '';
  currentPlaylist: IPlaylist = {
    name: '',
    tracks: [],
  };

  constructor(private store: Store, private router: Router) {}

  handleStoreUpdate() {
    const currentPlaylists = this.store.dataStore.getState().playlist.playlists;
    this.currentPlaylist = {
      name: this.playlistName,
      tracks: currentPlaylists[this.playlistName],
    };
  }

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

  playTrackFromPlaylist(trackName, artistName, image) {
    const { tracks, name } = this.currentPlaylist;
    this.store.dataStore.dispatch(addPlayListToNowPlaying(tracks, name));
    this.store.dataStore.dispatch(playSelectedTrack(trackName, artistName, image));
  }

  removeTrackFromPlaylist(trackName, artistName, image) {
    this.store.dataStore.dispatch(
      removeTrackFromPlaylist(
        {
          trackName,
          artistName,
          image,
        },
        this.playlistName
      )
    );
  }

  removePlaylist() {
    this.store.dataStore.dispatch(removePlaylist(this.currentPlaylist.name));
    this.router.navigateToRoute('library');
  }

  playPlaylist() {
    const { name, tracks } = this.currentPlaylist;
    this.store.dataStore.dispatch(addPlayListToNowPlaying(tracks, name));

    const { trackName, artistName, image } = tracks[0];
    this.store.dataStore.dispatch(playSelectedTrack(trackName, artistName, image));
  }

  activate(params: IParams, routeConfig: RouteConfig) {
    routeConfig.navModel.setTitle(params.id);
    this.playlistName = params.id;
  }

  attached() {
    this.reduxSubscription = this.store.dataStore.subscribe(this.handleStoreUpdate.bind(this));
    this.handleRouteAttachment();
    this.initializeElements();
  }

  detached() {
    this.reduxSubscription();
  }

  initializeElements() {
    UIkit.grid(this.detailGrid);
  }
}
