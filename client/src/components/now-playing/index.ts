import { inject } from 'aurelia-framework';
import { Unsubscribe } from 'redux';

// @ts-ignore
import * as UIkit from 'uikit';

import { ITrackBasic, ITrack } from '../../common/interfaces/track-interface';
import Store from '../../common/utils/store';
import { TRACK_IMAGE_PLACEHOLDER } from '../../common/utils/constants';
import { removeFromNowPlaying } from '../../common/actions/now-playing-actions';
import { selectTrackForPlaylist } from '../../common/actions/track-playlist-action';
import { playSelectedTrack } from '../../common/actions/player-actions';

@inject(Store)
export class NowPlaying {

  nowPlayingGrid: HTMLElement;
  reduxSubscription: Unsubscribe;

  currentTrack: ITrackBasic = {
    trackName: '',
    artistName: '',
    image: '',
  };
  tracks: ITrack[] = [];

  constructor(private store: Store) {}

  handleStoreUpdate() {
    const { trackName, artistName, image } = this.store.dataStore.getState().player.currentTrack;
    this.currentTrack = {
      trackName,
      artistName,
      image: image ? image : TRACK_IMAGE_PLACEHOLDER,
    };

    const tracks = this.store.dataStore.getState().nowPlaying.tracks;
    this.tracks = tracks.slice();
  }

  handleTracksPlay(trackName: string, artistName: string, image: string, index: number) {
    this.store.dataStore.dispatch(playSelectedTrack(trackName, artistName, image));
  }

  handleTracksAddToPlaylist(trackName: string, artistName: string, image: string, index: number) {
    this.store.dataStore.dispatch(
      selectTrackForPlaylist({
        trackName,
        artistName,
        image,
      })
    );
  }

  handleTracksRemove(trackName: string, artistName: string, image: string, id: number) {
    this.store.dataStore.dispatch(removeFromNowPlaying(id));
  }

  attached() {
    this.reduxSubscription = this.store.dataStore.subscribe(this.handleStoreUpdate.bind(this));
    this.handleStoreUpdate();
    this.initializeElements();
  }

  detached() {
    this.reduxSubscription();
  }

  initializeElements() {
    UIkit.grid(this.nowPlayingGrid);
  }
}
