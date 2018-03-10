import { inject } from 'aurelia-framework';
import { Unsubscribe } from 'redux';
import { RouteConfig } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

import { ITrackBasic } from '../../common/interfaces/track-interface';
import { ISearchResults } from '../../common/interfaces/search-result-interface';

import Store from '../../common/utils/store';
import SearchService from '../../common/services/searchService';

import { selectTrackForPlaylist } from '../../common/actions/track-playlist-action';
import { playSelectedTrack } from '../../common/actions/player-actions';
import { addToNowPlaying } from '../../common/actions/now-playing-actions';

interface IParams {
  query: string;
}

@inject(Store, SearchService, EventAggregator)
export class Search {
  reduxSubscription: Unsubscribe;

  searchQuery: string;
  tracks: ITrackBasic[];
  searchLoading: boolean = false;

  constructor(
    private store: Store,
    private searchService: SearchService,
    private es: EventAggregator
  ) {}

  handleStoreUpdate() {}

  handleTracksAddToPlaylist(trackName: string, artistName: string, image: string) {
    this.store.dataStore.dispatch(selectTrackForPlaylist({ trackName, artistName, image }));
  }

  handleTracksPlay(trackName: string, artistName: string, image: string) {
    this.store.dataStore.dispatch(playSelectedTrack(trackName, artistName, image));
    this.store.dataStore.dispatch(addToNowPlaying(trackName, artistName, image));
  }

  fetchSearchData() {
    this.searchLoading = true;

    this.searchService.getSearchResults(this.searchQuery).then((data: ISearchResults) => {
      this.searchLoading = false;
      const tracks = data.results.trackmatches.track;
      const mappedTracks: ITrackBasic[] = tracks.map(track => {
        return {
          trackName: track.name,
          artistName: track.artist,
          image: track.image[2]['#text'],
        };
      });
      this.tracks = mappedTracks;
    });
  }

  activate(params: IParams, routeConfig: RouteConfig) {
    routeConfig.navModel.setTitle(params.query);
    this.searchQuery = params.query;

    if (this.searchQuery) {
      this.fetchSearchData();
    }
  }

  attached() {
    this.es.publish('search', this.searchQuery);
    this.reduxSubscription = this.store.dataStore.subscribe(this.handleStoreUpdate.bind(this));
  }

  detached() {
    this.reduxSubscription();
  }
}
