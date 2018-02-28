import { inject } from 'aurelia-framework';

// @ts-ignore
import * as UIkit from 'uikit';

import Store from '../../common/utils/store';

@inject(Store)
export class MyLibrary {
  playlistName: string = '';
  newPlaylistModal: HTMLElement;

  constructor(private store: Store) {}

  addNewPlaylist() {
    console.log(this.playlistName);
    this.playlistName = '';
    UIkit.modal(this.newPlaylistModal).hide();
  }

  openNewPlaylistModal() {
    UIkit.modal(this.newPlaylistModal).show();
  }

  attached() {
    UIkit.modal(this.newPlaylistModal, {
      bgClose: false,
    });
  }
}
