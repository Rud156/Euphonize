import { inject } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';
import { Unsubscribe } from 'redux';
import { EventAggregator } from 'aurelia-event-aggregator';

// @ts-ignore
import * as UIkit from 'uikit';

import Store from '../../common/utils/store';
import {
  IPlaylist,
  IPlaylistView,
  IPlaylistDictionary,
} from '../../common/interfaces/playlist-interface';
import { ITrackBasic } from '../../common/interfaces/track-interface';
import { deployPlaylists, createPlaylist } from '../../common/actions/playlist-actions';
import { convertDictToList, convertDictToPlaylistView } from '../../common/utils/player-utils';
import { addPlayListToNowPlaying } from '../../common/actions/now-playing-actions';
import { playSelectedTrack } from '../../common/actions/player-actions';

@inject(Store, EventAggregator)
export class MyLibrary {
  router: Router;
  reduxSubscription: Unsubscribe;

  newPlaylistModal: HTMLElement;
  playlistImportForm: HTMLElement;
  playlistGrid: HTMLElement;

  playlistName: string = '';
  playlistFile: File[] = [];
  fileContents: string;

  fileReader: FileReader = new FileReader();

  playlists: IPlaylistView[] = [];

  constructor(private store: Store, private ea: EventAggregator) {
    this.fileReader.onload = (event: Event) => {
      // @ts-ignore
      this.fileContents = event.target.result;
    };
  }

  handleStoreUpdate() {
    const playlists = this.store.dataStore.getState().playlist.playlists;
    const modifiedPlaylists: IPlaylistView[] = convertDictToPlaylistView(playlists);
    this.playlists = modifiedPlaylists;
  }

  addNewPlaylist() {
    if (this.playlistName) {
      this.store.dataStore.dispatch(createPlaylist(this.playlistName));
      this.playlistName = '';
      UIkit.modal(this.newPlaylistModal).hide();
    } else {
      this.handleFilePlaylistSave();
      UIkit.modal(this.newPlaylistModal).hide();
    }
  }

  playPlaylist(playlist: IPlaylistView) {
    const playlists: IPlaylistDictionary = this.store.dataStore.getState().playlist.playlists;
    const selectedPlaylistTracks: ITrackBasic[] = playlists[playlist.name];
    this.store.dataStore.dispatch(addPlayListToNowPlaying(selectedPlaylistTracks, playlist.name));

    const { trackName, artistName, image } = selectedPlaylistTracks[0];
    this.store.dataStore.dispatch(playSelectedTrack(trackName, artistName, image));
  }

  handleFilePlaylistSave() {
    const currentPlaylists = this.store.dataStore.getState().playlist.playlists;
    const uploadedPlaylists: IPlaylistDictionary[] = JSON.parse(this.fileContents);

    const keys = Object.keys(uploadedPlaylists);
    keys.forEach(key => {
      if (key in currentPlaylists) {
        const currentTracks: ITrackBasic[] = currentPlaylists[key];
        const uploadedTracks: ITrackBasic[] = uploadedPlaylists[key];

        uploadedTracks.forEach(track => {
          const index = currentTracks.findIndex(
            _ => _.trackName === track.trackName && _.artistName === track.artistName
          );
          if (index === -1) {
            currentTracks.push(track);
          }
        });

        currentPlaylists[key] = currentTracks;
      } else {
        currentPlaylists[key] = uploadedPlaylists[key];
      }
    });

    this.store.dataStore.dispatch(deployPlaylists(currentPlaylists));
  }

  openNewPlaylistModal() {
    UIkit.modal(this.newPlaylistModal).show();
  }

  exportPlaylistModal() {
    const currentPlaylists = this.store.dataStore.getState().playlist.playlists;
    const dataString: string = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(currentPlaylists)
    )}`;

    const anchorElement = document.createElement('a');
    anchorElement.setAttribute('href', dataString);
    anchorElement.setAttribute('download', 'playlist.json');

    if (document.createEvent) {
      const event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      anchorElement.dispatchEvent(event);
    } else {
      anchorElement.click();
    }
  }

  handleFileUpload(event: Event) {
    if (this.playlistFile.length >= 1) {
      const file: File = this.playlistFile[0];
      this.fileReader.readAsText(file);
    }
  }

  inputFocused() {
    this.ea.publish('disablePreventDefault');
  }

  inputBlurred() {
    this.ea.publish('enablePreventDefault');
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
    UIkit.modal(this.newPlaylistModal, {
      bgClose: false,
    });
    UIkit.formCustom(this.playlistImportForm);
    UIkit.grid(this.playlistGrid);
  }
}
