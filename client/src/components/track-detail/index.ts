import { RouteConfig } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

// @ts-ignore
import * as UIkit from 'uikit';

import {
  ITrackDataResponse,
  ISimilarTrackResponse,
  ITrackData,
  ITrackResponse,
} from '../../common/interfaces/track-interface';
import TrackService from '../../common/services/trackService';
import Store from '../../common/utils/store';
import { playSelectedTrack } from '../../common/actions/player-actions';
import { addToNowPlaying } from '../../common/actions/now-playing-actions';
import { selectTrackForPlaylist } from '../../common/actions/track-playlist-action';

interface IParams {
  name: string;
  track: string;
}

@inject(TrackService, Store, EventAggregator)
export class TrackDetail {
  detailGrid: HTMLElement;

  trackName: string = '';
  artistName: string = '';

  trackInfoLoading: boolean = false;
  trackInfo: ITrackData;
  similarTracksLoading: boolean = false;
  similarTracks: ITrackResponse[] = [];
  trackInfoLoadingSuccess: boolean = true;

  constructor(
    private trackService: TrackService,
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

  fetchTrackInfo() {
    this.trackInfoLoading = true;
    this.trackInfoLoadingSuccess = true;

    this.trackService
      .getTrackInfo(this.trackName, this.artistName)
      .then((data: ITrackDataResponse) => {
        if (data.success) {
          this.trackInfo = data['track_data'];
        } else {
          this.trackInfoLoadingSuccess = false;
        }
        this.trackInfoLoading = false;
      });
  }

  fetchSimilarTracks() {
    this.similarTracksLoading = true;

    this.trackService
      .getSimilarTracks(this.trackName, this.artistName)
      .then((data: ISimilarTrackResponse) => {
        if (data.success) {
          this.similarTracks = data['similar_tracks'];
        }

        this.similarTracksLoading = false;
      });
  }

  activate(params: IParams, routeConfig: RouteConfig) {
    routeConfig.navModel.setTitle(params.track);

    this.trackName = params.track;
    this.artistName = params.name;

    if (this.trackName) {
      this.fetchTrackInfo();
      this.fetchSimilarTracks();
    }
  }

  publishNotification(eventType: string, message: string, error: object) {
    this.ea.publish('notification', {
      type: eventType,
      message,
      data: error,
    });
  }

  attached() {
    this.initializeElements();
  }

  initializeElements() {
    UIkit.grid(this.detailGrid);
  }
}
