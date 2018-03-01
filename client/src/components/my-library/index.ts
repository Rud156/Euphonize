import { inject } from 'aurelia-framework';

// @ts-ignore
import * as UIkit from 'uikit';

import Store from '../../common/utils/store';
import { IPlaylist, IPlaylistDictionary } from '../../common/interfaces/playlist-interface';
import { deployPlaylists } from '../../common/actions/playlist-actions';

@inject(Store)
export class MyLibrary {
  newPlaylistModal: HTMLElement;
  playlistImportForm: HTMLElement;

  playlistName: string = '';
  playlistFile: File[] = [];
  fileContents: string;
  savingPlaylist: boolean = false;

  fileReader: FileReader = new FileReader();

  constructor(private store: Store) {
    this.fileReader.onload = (event: Event) => {
      // @ts-ignore
      this.fileContents = event.target.result;
    };
  }

  addNewPlaylist() {
    if (this.playlistName) {
      console.log(this.playlistName);
      this.playlistName = '';
      UIkit.modal(this.newPlaylistModal).hide();
    } else {
      this.savingPlaylist = true;
      Promise.resolve(this.handleFilePlaylistSave()).then(() => {
        this.savingPlaylist = false;
      });
    }
  }

  handleFilePlaylistSave() {
    const currentPlaylists = this.store.dataStore.getState().playlist.playlists;
    const uploadedPlaylists: IPlaylist[] = JSON.parse(this.fileContents);

    uploadedPlaylists.forEach(element => {
      if (element.name in currentPlaylists) {
        const currentTracks = currentPlaylists[element.name];
        const newTracks = element.tracks;

        for (let i = 0; i < newTracks.length; i++) {
          let found = false;

          for (let j = 0; j < currentTracks.length; j++) {
            if (
              currentTracks[j].trackName === newTracks[i].trackName &&
              currentTracks[j].artistName === newTracks[i].artistName
            ) {
              found = true;
              break;
            }
          }

          if (!found) {
            currentTracks.push(newTracks[i]);
          }
        }

        currentPlaylists[element.name] = currentTracks;
      } else {
        currentPlaylists[element.name] = element.tracks;
      }
    });

    this.store.dataStore.dispatch(deployPlaylists(currentPlaylists));
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
