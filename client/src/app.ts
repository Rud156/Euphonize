import { inject } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { RouterConfiguration, Router } from 'aurelia-router';
import { Unsubscribe } from 'redux';
import * as _ from 'lodash';

// @ts-ignore
import * as UIkit from 'uikit';
// @ts-ignore
import * as Noty from 'Noty';
import 'fontawesome';

import { CONTENT_TYPES, PLAYLIST_LOCAL_STORAGE } from './common/utils/constants';
import Store from './common/utils/store';
import { readFromLocalStorage } from './common/utils/utils';

import { ISelectablePlaylist, IPlaylistDictionary } from './common/interfaces/playlist-interface';
import { ISearchResults } from './common/interfaces/search-result-interface';
import { ITrackBasic } from './common/interfaces/track-interface';
import { deployPlaylists, addTrackToMultiplePlaylists } from './common/actions/playlist-actions';
import { removeSelectedTrack } from './common/actions/track-playlist-action';
import { addToNowPlaying } from './common/actions/now-playing-actions';
import { updateSearchResults } from './common/actions/search-actions';

@inject(Store, EventAggregator)
export class App {
  router: Router;
  reduxSubscription: Unsubscribe;

  sidebarRef: HTMLElement;
  playlistModal: HTMLElement;
  sidebarShowing: boolean = false;
  searchString: string = '';
  styleString: string = 'color: white';

  playlists: ISelectablePlaylist[] = [];
  selectedTrack: ITrackBasic = {
    artistName: '',
    trackName: '',
    image: '',
  };

  notificationSubs: Subscription;
  searchSubs: Subscription;

  constructor(private store: Store, private ea: EventAggregator) {
    this.notificationSubs = this.ea.subscribe(
      'notification',
      this.handleDisplayNotification.bind(this)
    );
    this.searchSubs = this.ea.subscribe('search', this.handleSearchQuery.bind(this));

    this.handleDebouncedSearch = _.debounce(this.handleDebouncedSearch, 250);
  }

  handleStoreUpdate() {
    const selectedTrack = this.store.dataStore.getState().trackPlaylist.selectedTrack;
    if (
      selectedTrack.artistName !== this.selectedTrack.artistName &&
      selectedTrack.trackName !== this.selectedTrack.trackName
    ) {
      this.createPlaylistAndShowModal();
    }
  }

  handleDisplayNotification(notification) {
    const message: string = notification.message;
    const notificationType: string = notification.type;

    new Noty({
      theme: 'metroui',
      type: notificationType,
      layout: 'topRight',
      text: message,
      timeout: 5000,
    }).show();

    const data: object = notification.data;
    console.log(data);
  }

  handleSearchQuery(searchQuery) {
    this.searchString = searchQuery;
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;
    config.title = 'Fumen';
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      {
        route: '',
        redirect: 'tracks',
      },
      {
        route: 'library',
        name: 'library',
        moduleId: './components/my-library/index',
        nav: true,
        title: 'My Library',
      },
      {
        route: 'library/:id',
        name: 'libraryDetail',
        moduleId: './components/library-detail/index',
        nav: false,
      },
      {
        route: 'playing',
        name: 'playing',
        moduleId: './components/now-playing/index',
        nav: true,
        title: 'Now Playing',
      },
      {
        route: 'tracks',
        name: 'tracks',
        moduleId: './components/tracks/index',
        nav: true,
        title: 'Tracks',
      },
      {
        route: 'albums',
        name: 'albums',
        moduleId: './components/albums/index',
        nav: true,
        title: 'Artists',
      },
      {
        route: 'artists',
        name: 'artists',
        moduleId: './components/artists/index',
        nav: true,
        title: 'Albums',
      },
      {
        route: 'genre',
        name: 'genre',
        moduleId: './components/genre/index',
        nav: true,
        title: 'Genre',
      },
      {
        route: ['search', 'search/:query'],
        name: 'search',
        moduleId: './components/search-tracks/index',
        nav: false,
      },
    ]);
  }

  handleSearchInput() {
    this.handleDebouncedSearch();
  }

  handleDebouncedSearch() {
    this.router.navigateToRoute('search', { query: this.searchString });
  }

  createPlaylistAndShowModal() {
    const playlists = this.store.dataStore.getState().playlist.playlists;
    this.selectedTrack = this.store.dataStore.getState().trackPlaylist.selectedTrack;
    const keys = Object.keys(playlists);

    this.playlists = keys.map(element => {
      return {
        selected: false,
        name: element,
      };
    });
    UIkit.modal(this.playlistModal).show();
  }

  handleCheckboxSelect(index: number, state: boolean) {
    this.playlists[index].selected = state;
  }

  handleSaveData() {
    const selectedPlaylists = this.playlists
      .filter(element => {
        return element.selected;
      })
      .map(element => {
        return element.name;
      });

    const currentPlayingPlaylistName: string = this.store.dataStore.getState().nowPlaying.name;
    if (selectedPlaylists.findIndex(_ => _ === currentPlayingPlaylistName) !== -1) {
      const { trackName, artistName, image } = this.selectedTrack;
      this.store.dataStore.dispatch(addToNowPlaying(trackName, artistName, image));
    }

    this.store.dataStore.dispatch(
      addTrackToMultiplePlaylists(this.selectedTrack, selectedPlaylists)
    );

    UIkit.modal(this.playlistModal).hide();
    this.closePlaylistModal();
  }

  closePlaylistModal() {
    this.playlists = this.playlists.map((playlist: ISelectablePlaylist) => {
      return {
        name: playlist.name,
        selected: false,
      };
    });
    this.selectedTrack = {
      trackName: '',
      artistName: '',
      image: '',
    };
    this.store.dataStore.dispatch(removeSelectedTrack());
  }

  attached() {
    this.reduxSubscription = this.store.dataStore.subscribe(this.handleStoreUpdate.bind(this));

    this.handleStoreUpdate();
    this.initializeElements();
    this.readPlaylistsFromLocalStorage();
  }

  detached() {
    this.reduxSubscription();
    this.notificationSubs.dispose();
    this.searchSubs.dispose();
    // @ts-ignore
    this.sidebarRef.$destroy();
  }

  closeSidebar() {
    this.sidebarShowing = false;
  }

  inputFocused() {
    this.ea.publish('disablePreventDefault');
    this.styleString = 'color: #666';
  }

  inputBlurred() {
    this.ea.publish('enablePreventDefault');
    this.styleString = 'color: white';
  }

  toggleSidebar() {
    if (this.sidebarShowing) {
      UIkit.offcanvas(this.sidebarRef).hide();
      this.sidebarShowing = false;
    } else {
      UIkit.offcanvas(this.sidebarRef).show();
      this.sidebarShowing = true;
    }
  }

  readPlaylistsFromLocalStorage() {
    let playlists: IPlaylistDictionary = readFromLocalStorage(PLAYLIST_LOCAL_STORAGE);
    if (!playlists) playlists = {};
    this.store.dataStore.dispatch(deployPlaylists(playlists));
  }

  initializeElements() {
    UIkit.offcanvas(this.sidebarRef, {
      overlay: true,
    });
    UIkit.offcanvas(this.sidebarRef).hide();

    UIkit.util.on(this.sidebarRef, 'hidden', () => {
      this.closeSidebar();
    });

    UIkit.modal(this.playlistModal);
    UIkit.util.on(this.playlistModal, 'hidden', () => {
      this.closePlaylistModal();
    });
  }
}
