import { inject } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { RouterConfiguration, Router } from 'aurelia-router';

// @ts-ignore
import * as UIkit from 'uikit';
import 'fontawesome';

import { CONTENT_TYPES, PLAYLIST_LOCAL_STORAGE } from './common/utils/constants';
import Store from './common/utils/store';
import { readFromLocalStorage } from './common/utils/utils';

import { ISelectablePlaylist, IPlaylistDictionary } from './common/interfaces/playlist-interface';
import { deployPlaylists, addTrackToMultiplePlaylists } from './common/actions/playlist-actions';
import { ITrackBasic } from './common/interfaces/track-interface';
import { removeSelectedTrack } from './common/actions/track-playlist-action';
import { addToNowPlaying } from './common/actions/now-playing-actions';

@inject(Store, EventAggregator)
export class App {
  router: Router;

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

  constructor(private store: Store, private ea: EventAggregator) {
    this.store.dataStore.subscribe(this.handleStoreUpdate.bind(this));
    this.notificationSubs = this.ea.subscribe(
      'notification',
      this.handleDisplayNotification.bind(this)
    );
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

    UIkit.notification({
      message: message,
      status: notificationType,
      pos: 'top-right',
      timeout: 5000,
    });

    const data: object = notification.data;
    console.log(data);
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
    ]);
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
    this.handleStoreUpdate();
    this.initializeElements();
    this.readPlaylistsFromLocalStorage();
  }

  detached() {
    this.notificationSubs.dispose();
    // @ts-ignore
    this.sidebarRef.$destroy();
  }

  closeSidebar() {
    this.sidebarShowing = false;
  }

  inputFocused() {
    this.styleString = 'color: #666';
  }

  inputBlurred() {
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
    UIkit.offcanvas(this.sidebarRef);
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
