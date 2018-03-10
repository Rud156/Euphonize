import { inject } from 'aurelia-framework';
import { Unsubscribe } from 'redux';

// @ts-ignore
import * as UIkit from 'uikit';

import { ITrackBasic } from '../../common/interfaces/track-interface';
import Store from '../../common/utils/store';

@inject(Store)
export class NowPlaying {
  reduxSubscription: Unsubscribe;

  currentTrack: ITrackBasic = {
    trackName: '',
    artistName: '',
    image: '',
  };

  constructor(private store: Store) {}

  handleStoreUpdate() {
    const currentTrack = this.store.dataStore.getState().player.currentTrack;
    this.currentTrack = currentTrack;
  }

  attached() {
    this.reduxSubscription = this.store.dataStore.subscribe(this.handleStoreUpdate.bind(this));
  }

  detached() {
    this.reduxSubscription();
  }
}
