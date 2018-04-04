import { inject } from 'aurelia-framework';
import { Router, RouteConfig } from 'aurelia-router';

// @ts-ignore
import * as UIkit from 'uikit';

import ArtistService from '../../common/services/artistService';
import TrackService from '../../common/services/trackService';
import Store from '../../common/utils/store';
import {
  IArtistData,
  ISimilarArtist,
  ISimilarArtistsRawData,
  IArtistInfoRawData,
  IArtistTopTracks,
} from '../../common/interfaces/artist-interface';
import { addToNowPlaying } from '../../common/actions/now-playing-actions';
import { playSelectedTrack } from '../../common/actions/player-actions';
import { selectTrackForPlaylist } from '../../common/actions/track-playlist-action';

interface IParams {
  name: string;
}

@inject(ArtistService, TrackService, Router, Store)
export class ArtistDetail {
  artistInfoGrid: HTMLElement;
  similarArtistsSlider: HTMLElement;
  topTracksSlider: HTMLElement;

  artistName: string = '';

  artistInfoLoadingSuccess: boolean = true;
  artistInfoLoading: boolean = false;
  artistInfo: IArtistData = null;

  similarArtistsLoading: boolean = false;
  similarArtists: ISimilarArtist[] = [];

  artistTopTracksLoading: boolean = false;
  artistTopTracks: string[] = [];

  constructor(
    private artistService: ArtistService,
    private trackService: TrackService,
    private router: Router,
    private store: Store
  ) {}

  handleTracksPlay(trackName: string, artistName: string, image: string) {
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

  fetchArtistInfo() {
    this.artistInfoLoading = true;
    this.artistInfoLoadingSuccess = true;

    this.artistService.getArtistInfo(this.artistName).then((data: IArtistInfoRawData) => {
      if (data.success) {
        this.artistInfo = data['artist_data'];
      } else {
        this.artistInfoLoadingSuccess = false;
      }

      this.artistInfoLoading = false;
    });
  }

  fetchSimilarArtists() {
    this.similarArtistsLoading = true;

    this.artistService.getSimilarArtists(this.artistName).then((data: ISimilarArtistsRawData) => {
      if (data.success) {
        this.similarArtists = data['similar_artists'];
      }

      this.similarArtistsLoading = false;
    });
  }

  fetchArtistTopTracks() {
    this.artistTopTracksLoading = true;

    this.trackService.getArtistTopTracks(this.artistName).then((data: IArtistTopTracks) => {
      if (data.success) {
        this.artistTopTracks = data.artist_tracks;
      }
      this.artistTopTracksLoading = false;
    });
  }

  activate(params: IParams, routeConfig: RouteConfig) {
    routeConfig.navModel.setTitle(params.name);
    this.artistName = params.name;

    if (this.artistName) {
      this.fetchArtistInfo();
      this.fetchSimilarArtists();
      this.fetchArtistTopTracks();
    }
  }

  attached() {
    this.initializeElements();
  }

  initializeElements() {
    UIkit.grid(this.artistInfoGrid);
    UIkit.slider(this.similarArtistsSlider, {
      finite: true,
    });
    UIkit.slider(this.topTracksSlider, {
      finite: true,
    });
  }
}
