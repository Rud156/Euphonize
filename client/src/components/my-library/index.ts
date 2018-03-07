import { inject } from 'aurelia-framework';

// @ts-ignore
import * as UIkit from 'uikit';

import Store from '../../common/utils/store';
import {
  IPlaylist,
  IPlaylistView,
  IPlaylistDictionary,
} from '../../common/interfaces/playlist-interface';
import { deployPlaylists, createPlaylist } from '../../common/actions/playlist-actions';
import { convertDictToList, convertDictToPlaylistView } from '../../common/utils/player-utils';
import { ITrackBasic } from '../../common/interfaces/track-interface';

@inject(Store)
export class MyLibrary {
  newPlaylistModal: HTMLElement;
  playlistImportForm: HTMLElement;
  playlistGrid: HTMLElement;

  playlistName: string = '';
  playlistFile: File[] = [];
  fileContents: string;
  savingPlaylist: boolean = false;

  fileReader: FileReader = new FileReader();

  playlists: IPlaylistView[] = [];

  constructor(private store: Store) {
    this.fileReader.onload = (event: Event) => {
      // @ts-ignore
      this.fileContents = event.target.result;
    };

    this.store.dataStore.subscribe(this.handleStoreUpdate.bind(this));
  }

  handleStoreUpdate() {
    const playlist = this.store.dataStore.getState().playlist.playlists;
    const modifiedPlaylists: IPlaylistView[] = convertDictToPlaylistView(playlist);
    this.playlists = modifiedPlaylists;
  }

  addNewPlaylist() {
    if (this.playlistName) {
      this.store.dataStore.dispatch(createPlaylist(this.playlistName));
      this.playlistName = '';
      UIkit.modal(this.newPlaylistModal).hide();
    } else {
      this.savingPlaylist = true;
      Promise.resolve(this.handleFilePlaylistSave()).then(() => {
        this.savingPlaylist = false;
        UIkit.modal(this.newPlaylistModal).hide();
      });
    }
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
    anchorElement.click();
    anchorElement.remove();
  }

  handleFileUpload(event: Event) {
    if (this.playlistFile.length >= 1) {
      const file: File = this.playlistFile[0];
      this.fileReader.readAsText(file);
    }
  }

  openPlaylist(playlist) {
    console.log(playlist)
  }

  attached() {
    this.handleStoreUpdate();
    this.initializeElements();
  }

  initializeElements() {
    UIkit.modal(this.newPlaylistModal, {
      bgClose: false,
    });
    UIkit.formCustom(this.playlistImportForm);
    UIkit.grid(this.playlistGrid);
  }
}
