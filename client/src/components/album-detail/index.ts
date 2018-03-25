import { RouteConfig } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

// @ts-ignore
import * as UIkit from 'uikit';

import { IAlbumResponse, IAlbumData } from '../../common/interfaces/album-interface';
import AlbumService from '../../common/services/albumService';
import Store from '../../common/utils/store';
import { selectTrackForPlaylist } from '../../common/actions/track-playlist-action';
import { addToNowPlaying } from '../../common/actions/now-playing-actions';
import { playSelectedTrack } from '../../common/actions/player-actions';

interface IParams {
  name: string;
  album: string;
}

@inject(AlbumService, Store, EventAggregator)
export class AlbumDetail {
  detailGrid: HTMLElement;

  albumTitle: string = '';
  artistName: string = '';

  albumLoading: boolean = false;
  albumInfo: IAlbumData;
  tracks: string[] = [];
  albumInfoLoadingSuccess: boolean = true;

  constructor(
    private albumService: AlbumService,
    private store: Store,
    private ea: EventAggregator
  ) {}

  addToNowPlayingAndPlay(trackName: string, artistName: string, image: string) {
    this.store.dataStore.dispatch(addToNowPlaying(trackName, artistName, image));
    this.store.dataStore.dispatch(playSelectedTrack(trackName, artistName, image));
  }

  handleTrackAddToPlaylist(trackName: string, artistName: string, image: string) {
    this.store.dataStore.dispatch(
      selectTrackForPlaylist({
        trackName,
        artistName,
        image,
      })
    );
  }

  fetchAlbumInfo() {
    this.albumLoading = true;
    this.albumInfoLoadingSuccess = true;

    this.albumService
      .getAlbumInfo(this.albumTitle, this.artistName)
      .then((data: IAlbumResponse) => {
        if (data.success) {
          this.albumInfo = data['album_data'];
          this.tracks = this.albumInfo.tracks;
        } else {
          this.albumInfoLoadingSuccess = false;
        }

        this.albumLoading = false;
      })
      .catch(error => {
        this.albumLoading = false;
        this.ea.publish('notification', {
          type: 'error',
          message: 'Yikes!! We were unable to load the data.',
          data: error,
        });
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

  initializeElements() {
    UIkit.grid(this.detailGrid);
  }
}
