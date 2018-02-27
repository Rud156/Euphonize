import { inject } from 'aurelia-framework';

// @ts-ignore
import * as UIkit from 'uikit';

import TrackService from '../../common/services/trackService';
import Store from '../../common/utils/store';

import { CONTENT_TYPES } from '../../common/utils/constants';

import { playSelectedTrack } from '../../common/actions/player-actions';
import { addToNowPlaying } from '../../common/actions/now-playing-actions';
import { selectTrackForPlaylist } from '../../common/actions/track-playlist-action';

@inject(TrackService, Store)
export class Tracks {
  sliderTracks: HTMLElement;

  topTracks = [];
  topTracksLoading: boolean = false;
  trendingTracks = [];
  trendingTracksLoading: boolean = false;

  constructor(private trackService: TrackService, private store: Store) {}

  handleTracksPlay(trackName: string, artistName: string, image: string) {
    this.addToNowPlayingAndPlay(trackName, artistName, image);
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

  attached() {
    this.initializeElements();
    this.fetchTrendingTracks();
    this.fetchTopTracks();
  }

  addToNowPlayingAndPlay(trackName: string, artistName: string, image: string) {
    this.store.dataStore.dispatch(addToNowPlaying(trackName, artistName, image));
    this.store.dataStore.dispatch(playSelectedTrack(trackName, artistName, image));
  }

  fetchTopTracks() {
    this.topTracksLoading = true;

    this.trackService
      .getTopTracks(CONTENT_TYPES.USER_CU)
      .then(data => {
        if (data.success) {
          this.topTracks = data.tracks;
        }
        this.topTracksLoading = false;
      })
      .catch(error => {
        console.log(error);
        this.topTracksLoading = false;
      });
  }

  fetchTrendingTracks() {
    this.trendingTracksLoading = true;

    this.trackService
      .getTopTrendingTracks()
      .then(data => {
        if (data.success) {
          this.trendingTracks = data.tracks;
        }
        this.trendingTracksLoading = false;
      })
      .catch(error => {
        console.log(error);
        this.trendingTracksLoading = false;
      });
  }

  initializeElements() {
    UIkit.slider(this.sliderTracks, {
      finite: true,
    });
  }
}
