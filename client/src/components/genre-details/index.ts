import { RouteConfig } from 'aurelia-router';
import { inject } from 'aurelia-framework';

// @ts-ignore
import * as UIkit from 'uikit';

import { ITrackGenreResponse, ITrackGenre } from '../../common/interfaces/track-interface';
import { IAlbumGenreResponse, IAlbumGenre } from '../../common/interfaces/album-interface';
import TrackService from '../../common/services/trackService';
import AlbumService from '../../common/services/albumService';
import { EventAggregator } from 'aurelia-event-aggregator';
import { addToNowPlaying } from '../../common/actions/now-playing-actions';
import { playSelectedTrack } from '../../common/actions/player-actions';
import { selectTrackForPlaylist } from '../../common/actions/track-playlist-action';
import Store from '../../common/utils/store';

interface IParams {
  name: string;
}

@inject(TrackService, AlbumService, EventAggregator, Store)
export class GenreDetails {
  sliderAlbums: HTMLElement;

  genreName: string = '';

  tracks: ITrackGenre[];
  tracksLoading: boolean = false;
  albums: IAlbumGenre[];
  albumsLoading: boolean = false;

  constructor(
    private trackService: TrackService,
    private albumService: AlbumService,
    private ea: EventAggregator,
    private store: Store
  ) {}

  addToNowPlayingAndPlay(trackName: string, artistName: string, image: string) {
    this.store.dataStore.dispatch(addToNowPlaying(trackName, artistName, image));
    this.store.dataStore.dispatch(playSelectedTrack(trackName, artistName, image));
  }

  handleTracksAddToPlaylist(trackName: string, artistName: string, image: string) {
    this.store.dataStore.dispatch(
      selectTrackForPlaylist({
        trackName,
        artistName,
        image,
      })
    );
  }

  fetchTrackData() {
    this.tracksLoading = true;

    this.trackService
      .getTracksForGenre(this.genreName)
      .then((data: ITrackGenreResponse) => {
        if (data.success) {
          this.tracks = data.tracks;
        }
        this.tracksLoading = false;
      })
      .catch(error => {
        this.publishNotification('error', 'Yikes!! We were unable to load the data.', error);
      });
  }

  fetchAlbumData() {
    this.albumsLoading = true;

    this.albumService
      .getAlbumsForGenre(this.genreName)
      .then((data: IAlbumGenreResponse) => {
        if (data.success) {
          this.albums = data.albums;
        }
        this.albumsLoading = false;
      })
      .catch(error => {
        this.publishNotification('error', 'Yikes!! We were unable to load the data.', error);
      });
  }

  activate(params: IParams, routeConfig: RouteConfig) {
    routeConfig.navModel.setTitle(params.name);
    this.genreName = params.name;

    if (this.genreName) {
      this.fetchTrackData();
      this.fetchAlbumData();
    }
  }

  attached() {
    this.initializeElements();
  }

  publishNotification(eventType: string, message: string, error: object) {
    this.ea.publish('notification', {
      type: eventType,
      message,
      data: error,
    });
  }

  initializeElements() {
    UIkit.slider(this.sliderAlbums, {
      finite: true,
    });
  }
}
