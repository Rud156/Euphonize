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
  ISelectablePlaylist,
} from '../../common/interfaces/playlist-interface';
import { ITrackBasic } from '../../common/interfaces/track-interface';
import { deployPlaylists, createPlaylist } from '../../common/actions/playlist-actions';
import { convertDictToList, convertDictToPlaylistView } from '../../common/utils/player-utils';
import { addPlayListToNowPlaying } from '../../common/actions/now-playing-actions';
import { playSelectedTrack } from '../../common/actions/player-actions';
import PlaylistService from '../../common/services/playlistService';

interface IPlaylistExportResponse {
  success: boolean;
  playlist_id: string;
  message?: string;
}

@inject(Store, EventAggregator, PlaylistService)
export class MyLibrary {
  router: Router;
  reduxSubscription: Unsubscribe;

  newPlaylistModal: HTMLElement;
  exportPlaylistModal: HTMLElement;
  playlistImportForm: HTMLElement;
  playlistGrid: HTMLElement;

  playlistName: string = '';
  playlistFile: File[] = [];
  fileContents: string;

  exportPlaylists: ISelectablePlaylist[] = [];
  exportPlaylistId: string = '';

  fileReader: FileReader = new FileReader();

  playlists: IPlaylistView[] = [];

  constructor(
    private store: Store,
    private ea: EventAggregator,
    private playlistService: PlaylistService
  ) {
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

  handleCheckboxSelect(index: number, state: boolean) {
    this.exportPlaylists[index].selected = state;
  }

  handleExportNewPlaylist() {
    const selectedPlaylists = this.exportPlaylists
      .filter(element => {
        return element.selected;
      })
      .map(element => {
        return element.name;
      });
    const selectedPlaylistsSet = new Set(selectedPlaylists);

    const currentPlaylists = this.store.dataStore.getState().playlist.playlists;
    const keysToBeDeleted = [];
    for (const key in currentPlaylists)
      if (!selectedPlaylistsSet.has(key)) keysToBeDeleted.push(key);

    keysToBeDeleted.forEach(key => {
      delete currentPlaylists[key];
    });

    this.playlistService
      .generatePlaylistLink(currentPlaylists)
      .then((data: IPlaylistExportResponse) => {
        if (data.success) {
          this.exportPlaylistId = data['playlist_id'];
        } else {
          this.publishNotification('error', data.message, {});
        }
      })
      .catch(error => {
        this.publishNotification('error', 'Yikes!!. Unable to connect to the server', error);
      });
  }

  handleUpdatePlaylist() {
    const selectedPlaylists = this.exportPlaylists
      .filter(element => {
        return element.selected;
      })
      .map(element => {
        return element.name;
      });
    const selectedPlaylistsSet = new Set(selectedPlaylists);

    const currentPlaylists = this.store.dataStore.getState().playlist.playlists;
    const keysToBeDeleted = [];
    for (const key in currentPlaylists)
      if (!selectedPlaylistsSet.has(key)) keysToBeDeleted.push(key);

    keysToBeDeleted.forEach(key => {
      delete currentPlaylists[key];
    });

    if (!this.exportPlaylistId) {
      this.publishNotification('error', 'Enter a the Playlist Id to update data', {});
    }

    this.playlistService
      .updatePlaylist(this.exportPlaylistId, currentPlaylists)
      .then((data: IPlaylistExportResponse) => {
        this.publishNotification(data.success ? 'success' : 'error', data.message, {});
      })
      .catch(error => {
        this.publishNotification('error', 'Yikes!!. Unable to connect to the server', error);
      });
  }

  handleAddNewPlaylist(playlistName: string) {
    this.store.dataStore.dispatch(createPlaylist(playlistName));
    this.openExportPlaylistModal();
  }

  openNewPlaylistModal() {
    UIkit.modal(this.newPlaylistModal).show();
  }

  openExportPlaylistModal() {
    const currentPlaylists = this.store.dataStore.getState().playlist.playlists;
    const keys = Object.keys(this.playlists);

    this.exportPlaylists = keys.map(element => {
      return {
        selected: false,
        name: element,
      };
    });

    UIkit.modal(this.exportPlaylistModal).show();
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

  publishNotification(eventType: string, message: string, error: object) {
    this.ea.publish('notification', {
      type: eventType,
      message,
      data: error,
    });
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
    UIkit.modal(this.exportPlaylistModal, {
      bgClose: false,
    });
    UIkit.formCustom(this.playlistImportForm);
    UIkit.grid(this.playlistGrid);
  }
}
