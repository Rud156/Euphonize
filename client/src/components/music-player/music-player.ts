import { inject } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { Unsubscribe } from 'redux';

// @ts-ignore
import * as UIkit from 'uikit';

import { ITrackBasic } from '../../common/interfaces/track-interface';
import { IReturn } from '../../common/interfaces/player-util-interface';

import { getNextTrack, getPrevTrack } from '../../common/utils/player-utils';

import { TRACK_IMAGE_PLACEHOLDER } from '../../common/utils/constants';

import Store from '../../common/utils/store';
import AudioService from '../../common/services/audioService';

import { shuffleNowPlaying } from '../../common/actions/now-playing-actions';
import { selectTrackForPlaylist } from '../../common/actions/track-playlist-action';
import { playSelectedTrack } from '../../common/actions/player-actions';

interface IPlayerTrackInterface extends ITrackBasic {
  currentTime: number;
  maxTime: number;
  audioURL: string;
  volume: number;
}

@inject(Store, AudioService, EventAggregator)
export class MusicPlayer {
  playerGrid: HTMLElement;
  reduxSubscription: Unsubscribe;

  disablePreventDefault: Subscription;
  enablePreventDefault: Subscription;
  preventDefaultEnabled: boolean = true;

  audioElement: HTMLAudioElement;
  audioIsPlaying: boolean = false;
  audioIsLoading: boolean = false;

  randomButton: HTMLElement;
  prevTrackButton: HTMLElement;
  playButton: HTMLElement;
  pauseButton: HTMLElement;
  nextTrackButton: HTMLElement;
  replayButtonNormal: HTMLElement;
  replayButtonRotated: HTMLElement;
  playlistButton: HTMLElement;
  seekSlider: HTMLInputElement;
  volumeSlider: HTMLInputElement;

  currentTrack: ITrackBasic = {
    trackName: '',
    artistName: '',
    image: '',
  };

  playingTrack: IPlayerTrackInterface = {
    currentTime: 0,
    maxTime: 0,
    audioURL: '',
    volume: 1,
    trackName: '',
    artistName: '',
    image: TRACK_IMAGE_PLACEHOLDER,
  };
  replay: boolean = false;

  constructor(
    private store: Store,
    private audioService: AudioService,
    private ea: EventAggregator
  ) {
    this.disablePreventDefault = this.ea.subscribe(
      'disablePreventDefault',
      this.handleDisablePreventDefault.bind(this)
    );
    this.enablePreventDefault = this.ea.subscribe(
      'enablePreventDefault',
      this.handleEnablePreventDefault.bind(this)
    );
  }

  handleStoreStateUpdate() {
    const currentTrack = this.store.dataStore.getState().player.currentTrack;
    if (
      currentTrack.trackName !== this.playingTrack.trackName &&
      currentTrack.artistName !== this.playingTrack.artistName
    ) {
      if (
        this.currentTrack.trackName !== currentTrack.trackName &&
        this.currentTrack.artistName !== currentTrack.artistName
      ) {
        this.currentTrack = currentTrack;
        this.fetchAndPlayTrack(currentTrack);
      }
    }
  }

  handleEnablePreventDefault() {
    this.preventDefaultEnabled = true;
  }

  handleDisablePreventDefault() {
    this.preventDefaultEnabled = false;
  }

  fetchAndPlayTrack(currentTrack: ITrackBasic) {
    this.audioIsLoading = true;

    this.audioService
      .getAudioURL(currentTrack.trackName, currentTrack.artistName)
      .then(data => {
        this.pauseAudio();

        if (data.success) {
          const trackData: IPlayerTrackInterface = {
            trackName: data.track['track_name'],
            artistName: data.track['artist_name'],
            image: data.track['image'],
            currentTime: 0,
            audioURL: data.track['url'],
            maxTime: 0,
            volume: 1,
          };
          this.audioIsLoading = false;
          this.playingTrack = trackData;
          this.audioElement.src = data.track['url'];
          this.audioElement.volume = 1;

          this.currentTrack = {
            trackName: '',
            artistName: '',
            image: '',
          };
        } else {
          const { message } = data;
          this.audioIsLoading = false;
          this.ea.publish('notification', {
            type: 'error',
            message: message,
            data: null,
          });
        }
      })
      .catch(error => {
        this.ea.publish('notification', {
          type: 'error',
          message: 'Yikes! We were unable to load track. Please try again',
          data: error,
        });
        this.currentTrack = {
          trackName: '',
          artistName: '',
          image: '',
        };
      });
  }

  playAudio() {
    if (!this.audioIsPlaying) {
      this.audioElement.play();
      this.audioIsPlaying = true;
    }
  }

  pauseAudio() {
    if (this.audioIsPlaying) {
      this.audioElement.pause();
      this.audioIsPlaying = false;
    }
  }

  handlePlayButtonClick() {
    this.playAudio();
  }

  handlePauseButtonClick() {
    this.pauseAudio();
  }

  togglePlayPause() {
    if (this.audioIsPlaying) {
      this.handlePauseButtonClick();
    } else {
      this.handlePlayButtonClick();
    }
  }

  handleRandomButtonClick() {
    this.store.dataStore.dispatch(shuffleNowPlaying(this.playingTrack));
  }

  handlePrevTrackButtonClick() {
    const currentTracks = this.store.dataStore.getState().nowPlaying.tracks;
    const result: IReturn = getPrevTrack(currentTracks, this.playingTrack);

    if (result.success) {
      const track = result.track;
      this.store.dataStore.dispatch(
        playSelectedTrack(track.trackName, track.artistName, track.image)
      );
    } else {
      this.ea.publish('notification', {
        type: 'warning',
        message: 'No previous track to play',
        data: {},
      });
    }
  }

  handleNextButtonClick() {
    const currentTracks = this.store.dataStore.getState().nowPlaying.tracks;
    const result: IReturn = getNextTrack(currentTracks, this.playingTrack);

    if (result.success) {
      const track = result.track;
      this.store.dataStore.dispatch(
        playSelectedTrack(track.trackName, track.artistName, track.image)
      );
    } else {
      this.ea.publish('notification', {
        type: 'warning',
        message: 'No next track to play',
        data: {},
      });
    }
  }

  handleReplayButtonClick() {
    this.replay = !this.replay;
  }

  handlePlaylistButtonClick() {
    this.store.dataStore.dispatch(selectTrackForPlaylist(this.playingTrack));
  }

  handleSeekSliderChange() {
    const currentTime = parseInt(this.seekSlider.value);
    const { playingTrack } = this;
    const modifiedTrackData = {
      ...playingTrack,
      currentTime,
    };

    this.audioElement.currentTime = currentTime;
    this.playingTrack = modifiedTrackData;
  }

  handleVolumeSliderChange() {
    const volume = parseFloat(this.volumeSlider.value);
    this.audioElement.volume = volume;
    const { playingTrack } = this;
    const modifiedTrackData = {
      ...playingTrack,
      volume,
    };
    this.playingTrack = modifiedTrackData;
  }

  handleTimeUpdate() {
    const { playingTrack } = this;
    const modifiedTrackData = {
      ...playingTrack,
      currentTime: this.audioElement.currentTime,
    };
    this.playingTrack = modifiedTrackData;

    this.checkAndSwitchToNextTrack();
  }

  handleKeyInputs(event: KeyboardEvent) {
    if (!this.preventDefaultEnabled) return;

    event.preventDefault();
    const { key } = event;

    switch (key) {
      case ' ':
        this.togglePlayPause();
        break;

      case 'a':
        this.handlePrevTrackButtonClick();
        break;

      case 'd':
        this.handleNextButtonClick();
        break;

      case 's':
        this.handleRandomButtonClick();
        break;

      case 'r':
        this.handleReplayButtonClick();
        break;

      default:
        break;
    }
  }

  checkAndSwitchToNextTrack() {
    if (this.audioElement.currentTime >= this.audioElement.duration) {
      this.pauseAudio();
      const currentTracks = this.store.dataStore.getState().nowPlaying.tracks;
      const result: IReturn = getNextTrack(currentTracks, this.playingTrack);

      if (result.success) {
        if ((result.repeat && this.replay) || !result.repeat) {
          const track = result.track;
          this.store.dataStore.dispatch(
            playSelectedTrack(track.trackName, track.artistName, track.image)
          );
        }
      }
    }
  }

  handleCanPlay(event: Event) {
    const { playingTrack } = this;
    const modifiedTrackData = {
      ...playingTrack,
      maxTime: this.audioElement.duration,
      currentTime: 0,
      volume: 1,
    };
    this.playingTrack = modifiedTrackData;
    this.playAudio();
  }

  attached() {
    this.reduxSubscription = this.store.dataStore.subscribe(this.handleStoreStateUpdate.bind(this));
    this.initializeElements();
    this.addAllEventListeners();
  }

  detached() {
    this.removeAllEventListeners();
    this.reduxSubscription();

    this.disablePreventDefault.dispose();
    this.enablePreventDefault.dispose();
  }

  addAllEventListeners() {
    this.audioElement.addEventListener('canplay', this.handleCanPlay.bind(this));
    this.audioElement.addEventListener('timeupdate', this.handleTimeUpdate.bind(this));
    this.playButton.addEventListener('click', this.handlePlayButtonClick.bind(this));
    this.pauseButton.addEventListener('click', this.handlePauseButtonClick.bind(this));
    this.nextTrackButton.addEventListener('click', this.handleNextButtonClick.bind(this));
    this.prevTrackButton.addEventListener('click', this.handlePrevTrackButtonClick.bind(this));
    this.playlistButton.addEventListener('click', this.handlePlaylistButtonClick.bind(this));
    this.replayButtonNormal.addEventListener('click', this.handleReplayButtonClick.bind(this));
    this.replayButtonRotated.addEventListener('click', this.handleReplayButtonClick.bind(this));
    this.randomButton.addEventListener('click', this.handleRandomButtonClick.bind(this));
    this.volumeSlider.addEventListener('input', this.handleVolumeSliderChange.bind(this));

    this.seekSlider.addEventListener('change', this.handleSeekSliderChange.bind(this));
    this.seekSlider.addEventListener('mousedown', this.pauseAudio.bind(this));
    this.seekSlider.addEventListener('mouseup', this.playAudio.bind(this));

    window.addEventListener('keypress', this.handleKeyInputs.bind(this));
  }

  removeAllEventListeners() {
    this.audioElement.removeEventListener('canplay', this.handleCanPlay);
    this.audioElement.removeEventListener('timeupdate', this.handleTimeUpdate);
    this.playButton.removeEventListener('click', this.handlePlayButtonClick);
    this.pauseButton.removeEventListener('click', this.handlePauseButtonClick);
    this.nextTrackButton.removeEventListener('click', this.handleNextButtonClick);
    this.prevTrackButton.removeEventListener('click', this.handlePrevTrackButtonClick);
    this.playlistButton.removeEventListener('click', this.handlePlaylistButtonClick);
    this.replayButtonNormal.removeEventListener('click', this.handleReplayButtonClick);
    this.replayButtonRotated.removeEventListener('click', this.handleReplayButtonClick);
    this.randomButton.removeEventListener('click', this.handleRandomButtonClick);
    this.volumeSlider.removeEventListener('input', this.handleVolumeSliderChange);

    this.seekSlider.removeEventListener('change', this.handleSeekSliderChange);
    this.seekSlider.removeEventListener('mousedown', this.pauseAudio);
    this.seekSlider.removeEventListener('mouseup', this.playAudio);

    window.removeEventListener('keypress', this.handleKeyInputs);
  }

  initializeElements() {
    UIkit.grid(this.playerGrid);
  }
}
