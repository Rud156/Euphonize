import { inject } from 'aurelia-framework';
import { Unsubscribe } from 'redux';

// @ts-ignore
import * as UIkit from 'uikit';

import { ITrackBasic } from '../../common/interfaces/track-interface';
import Store from '../../common/utils/store';
import { TRACK_IMAGE_PLACEHOLDER } from '../../common/utils/constants';

@inject(Store)
export class NowPlaying {
  nowPlayingGrid: HTMLElement;
  reduxSubscription: Unsubscribe;

  currentTrack: ITrackBasic = {
    trackName: '',
    artistName: '',
    image: '',
  };

  constructor(private store: Store) {}

  handleStoreUpdate() {
    const { trackName, artistName, image } = this.store.dataStore.getState().player.currentTrack;
    this.currentTrack = {
      trackName,
      artistName,
      image: image ? image : TRACK_IMAGE_PLACEHOLDER,
    };
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
    UIkit.grid();
  }
}
