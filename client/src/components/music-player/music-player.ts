// @ts-ignore
import * as UIkit from 'uikit';

export class MusicPlayer {
  playerGrid: HTMLElement;

  constructor() {}

  attached() {
    this.initializeElements();
  }

  initializeElements() {
    UIkit.grid(this.playerGrid);
  }
}
