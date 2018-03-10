import { inject } from 'aurelia-framework';
import { Unsubscribe } from 'redux';

import { ITrackBasic } from '../../common/interfaces/track-interface';

import Store from '../../common/utils/store';

@inject(Store)
export class Search {
  reduxSubscription: Unsubscribe;

  searchQuery: string;
  tracks: ITrackBasic[];

  constructor(private store: Store) {}

  handleStoreUpdate() {
    const { tracks, searchQuery } = this.store.dataStore.getState().search;
    this.tracks = tracks;
    this.searchQuery = searchQuery;
  }

  attached() {
    this.reduxSubscription = this.store.dataStore.subscribe(this.handleStoreUpdate.bind(this));
  }

  detached() {
    this.reduxSubscription();
  }
}
