import { inject } from 'aurelia-framework';
import * as _ from 'lodash';

// @ts-ignore
import * as UIkit from 'uikit';

import { ITrackInterface } from '../../common/reducers/player-reducer';
import Store from '../../common/utils/store';
import AudioService from '../../common/services/audioService';

interface IPlayerTrackInterface extends ITrackInterface {
  currentTime: string;
  minTime: string;
  maxTime: string;
  audioURL: string;
}

@inject(Store, AudioService)
export class MusicPlayer {
  playerGrid: HTMLElement;

  playerAudio: HTMLAudioElement;
  randomButton: HTMLElement;
  prevTrackButton: HTMLElement;
  playButton: HTMLElement;
  nextTrackButton: HTMLElement;
  replayButton: HTMLElement;
  favouriteButton: HTMLElement;
  seekSlider: HTMLElement;
  volumeSlider: HTMLElement;

  currentTrack: ITrackInterface;
  playingTrack: IPlayerTrackInterface;

  constructor(private store: Store, private audioService: AudioService) {
    this.store.dataStore.subscribe(this.handleStoreStateUpdate.bind(this));
  }

  handleStoreStateUpdate() {
    const currentTrack = this.store.dataStore.getState().player.currentTrack;
    if (currentTrack.trackName != this.playingTrack.trackName) {
      this.getSongData(currentTrack);
    }
  }

  getSongData(currentTrack: { trackName: string; artistName: string; image: string }) {
    this.audioService
      .getAudioURL(currentTrack.trackName, currentTrack.artistName)
      .then(data => {
        if (data.success) {
          const trackData = {
            trackName: data.track_name,
            artistName: data.artist_name,
            image: data.image,
          };
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleRandomButtonClick(event: MouseEvent) {}

  handlePrevTrackButtonClick(event: MouseEvent) {}

  handleNextButtonClick(event: MouseEvent) {}

  handlePlayButtonClick(event: MouseEvent) {}

  handleReplayButtonClick(event: MouseEvent) {}

  handleFavouriteButtonClick(event: MouseEvent) {}

  handleSeekSliderChange(event: Event) {}

  handleVolumeSliderChange(event: Event) {}

  attached() {
    this.initializeElements();
    this.addAllEventListeners();
  }

  detached() {
    this.removeAllEventListeners();
  }

  addAllEventListeners() {
    this.playButton.addEventListener('click', this.handlePlayButtonClick.bind(this));
    this.nextTrackButton.addEventListener('click', this.handleNextButtonClick.bind(this));
    this.prevTrackButton.addEventListener('click', this.handlePrevTrackButtonClick.bind(this));
    this.favouriteButton.addEventListener('click', this.handleFavouriteButtonClick.bind(this));
    this.replayButton.addEventListener('click', this.handleReplayButtonClick.bind(this));
    this.randomButton.addEventListener('click', this.handleRandomButtonClick.bind(this));
    this.seekSlider.addEventListener('change', this.handleSeekSliderChange.bind(this));
    this.volumeSlider.addEventListener('change', this.handleVolumeSliderChange.bind(this));
  }

  removeAllEventListeners() {
    this.playButton.removeEventListener('click', this.handlePlayButtonClick.bind(this));
    this.nextTrackButton.removeEventListener('click', this.handleNextButtonClick.bind(this));
    this.prevTrackButton.removeEventListener('click', this.handlePrevTrackButtonClick.bind(this));
    this.favouriteButton.removeEventListener('click', this.handleFavouriteButtonClick.bind(this));
    this.replayButton.removeEventListener('click', this.handleReplayButtonClick.bind(this));
    this.randomButton.removeEventListener('click', this.handleRandomButtonClick.bind(this));
    this.seekSlider.removeEventListener('change', this.handleSeekSliderChange.bind(this));
    this.volumeSlider.removeEventListener('change', this.handleVolumeSliderChange.bind(this));
  }

  initializeElements() {
    UIkit.grid(this.playerGrid);
  }
}
