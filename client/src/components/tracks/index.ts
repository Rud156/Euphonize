// @ts-ignore
import * as UIkit from 'uikit';

export class Tracks {
  sliderTracks: HTMLElement;

  constructor() {}

  attached() {
    UIkit.slider(this.sliderTracks);
  }
}
