import { RouteConfig } from 'aurelia-router';
import { inject } from 'aurelia-framework';

// @ts-ignore
import * as UIkit from 'uikit';

import { ITrackGenreResponse, ITrackResponse } from '../../common/interfaces/track-interface';
import { IAlbumGenreResponse, IAlbumData } from '../../common/interfaces/album-interface';
import TrackService from '../../common/services/trackService';
import AlbumService from '../../common/services/albumService';
import { addToNowPlaying } from '../../common/actions/now-playing-actions';
import { playSelectedTrack } from '../../common/actions/player-actions';
import { selectTrackForPlaylist } from '../../common/actions/track-playlist-action';
import Store from '../../common/utils/store';

interface IParams {
  name: string;
}

@inject(TrackService, AlbumService, Store)
export class GenreDetails {
  sliderAlbums: HTMLElement;

  genreName: string = '';

  tracks: ITrackResponse[];
  tracksLoading: boolean = false;
  albums: IAlbumData[];
  albumsLoading: boolean = false;

  constructor(
    private trackService: TrackService,
    private albumService: AlbumService,
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

    this.trackService.getTracksForGenre(this.genreName).then((data: ITrackGenreResponse) => {
      if (data.success) {
        this.tracks = data.tracks;
      }
      this.tracksLoading = false;
    });
  }

  fetchAlbumData() {
    this.albumsLoading = true;

    this.albumService.getAlbumsForGenre(this.genreName).then((data: IAlbumGenreResponse) => {
      if (data.success) {
        this.albums = data.albums;
      }
      this.albumsLoading = false;
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

  initializeElements() {
    UIkit.slider(this.sliderAlbums, {
      finite: true,
    });
  }
}
