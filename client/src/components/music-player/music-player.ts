import { inject } from 'aurelia-framework';

// @ts-ignore
import * as UIkit from 'uikit';

import Store from '../../common/utils/store';
import AudioService from '../../common/services/audioService';

@inject(Store, AudioService)
export class MusicPlayer {
  playerGrid: HTMLElement;
  playerAudio: HTMLAudioElement;

  constructor(private store: Store, private audioService: AudioService) {
    this.store.dataStore.subscribe(this.handleStoreStateUpdate.bind(this));
  }

  async handleStoreStateUpdate() {
    const currentTrack = this.store.dataStore.getState().player.currentTrack;
    this.audioService
      .getAudioURL(currentTrack.trackName, currentTrack.artistName)
      .then(data => {
        if (data.success) {
          // TODO: Fix This
          this.playerAudio.src = data.url;
          this.playerAudio.play();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  attached() {
    this.initializeElements();
  }

  initializeElements() {
    UIkit.grid(this.playerGrid);
  }
}
