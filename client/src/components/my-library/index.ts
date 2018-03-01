import { inject } from 'aurelia-framework';

// @ts-ignore
import * as UIkit from 'uikit';

import Store from '../../common/utils/store';
import { IPlaylist } from '../../common/interfaces/playlist-interface';

@inject(Store)
export class MyLibrary {
  newPlaylistModal: HTMLElement;
  playlistImportForm: HTMLElement;

  playlistName: string = '';
  playlistFile: File[] = [];
  fileContents: string;

  constructor(private store: Store) {}

  addNewPlaylist() {
    if (this.playlistName) {
      console.log(this.playlistName);
      this.playlistName = '';
      UIkit.modal(this.newPlaylistModal).hide();
    } else {
      const currentPlaylists: IPlaylist[] = this.store.dataStore.getState().playlist.playlists;
      const uploadedPlaylists: IPlaylist[] = JSON.parse(this.fileContents);
    }
    // TODO: Implement Logic to Handle File Upload
  }

  openNewPlaylistModal() {
    UIkit.modal(this.newPlaylistModal).show();
  }

  handleFileUpload(event: Event) {
    if (this.playlistFile.length >= 1) {
      console.log(this.playlistFile[0].name);
    }
  }

  attached() {
    UIkit.modal(this.newPlaylistModal, {
      bgClose: false,
    });
    UIkit.formCustom(this.playlistImportForm);
  }
}
