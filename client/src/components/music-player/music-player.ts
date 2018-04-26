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
  downloadButton: HTMLElement;

  volumeSlider: HTMLInputElement;
  volumeOn: HTMLElement;
  volumeOff: HTMLElement;

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
  trackEnded: boolean = false;

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
      currentTrack.trackName !== this.playingTrack.trackName ||
      currentTrack.artistName !== this.playingTrack.artistName
    ) {
      if (
        this.currentTrack.trackName !== currentTrack.trackName ||
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
      .getAudioURL(
        currentTrack.trackName,
        currentTrack.artistName,
        'Yikes! We were unable to load track. Please try again'
      )
      .then(data => {
        this.trackEnded = false;
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
        } else {
          const { message }: { message: string } = data;
          this.audioIsLoading = false;
          this.publishNotification('error', message, null);
        }

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
    if (this.audioIsLoading) {
      return;
    }

    const tracks = this.store.dataStore.getState().nowPlaying.tracks;
    if (tracks.length <= 0) {
      this.publishNotification('warning', 'No tracks playing to shuffle', {});
      return;
    }

    this.store.dataStore.dispatch(shuffleNowPlaying(this.playingTrack));
    this.publishNotification('success', 'Now Playing Shuffled', {});
  }

  handlePrevTrackButtonClick() {
    if (this.audioIsLoading) {
      return;
    }

    const currentTracks = this.store.dataStore.getState().nowPlaying.tracks;
    const currentTrack = this.store.dataStore.getState().player.currentTrack;
    const result: IReturn = getPrevTrack(currentTracks, currentTrack);

    if (result.success) {
      const track = result.track;
      this.store.dataStore.dispatch(
        playSelectedTrack(track.trackName, track.artistName, track.image)
      );
    } else {
      this.publishNotification('warning', 'No previous track to play', {});
    }
  }

  handleNextTrackButtonClick() {
    if (this.audioIsLoading) {
      return;
    }

    const currentTracks = this.store.dataStore.getState().nowPlaying.tracks;
    const currentTrack = this.store.dataStore.getState().player.currentTrack;
    const result: IReturn = getNextTrack(currentTracks, currentTrack);

    console.log(result);

    if (result.success) {
      const track = result.track;
      this.store.dataStore.dispatch(
        playSelectedTrack(track.trackName, track.artistName, track.image)
      );
    } else {
      this.publishNotification('warning', 'No next track to play', {});
    }
  }

  handleReplayButtonClick() {
    this.replay = !this.replay;
    if (this.replay) this.publishNotification('success', 'Now Playing set on repeat', {});
    else this.publishNotification('success', 'Now Playing repeat removed', {});
  }

  handlePlaylistButtonClick() {
    const tracks = this.store.dataStore.getState().nowPlaying.tracks;
    if (tracks.length <= 0) {
      this.publishNotification('warning', 'No tracks playing to add to playlist', {});
      return;
    }

    this.store.dataStore.dispatch(selectTrackForPlaylist(this.playingTrack));
  }

  handleDownloadButtonClick() {
    const { audioURL } = this.playingTrack;
    if (!audioURL) {
      this.publishNotification('warning', 'No Audio Playing.', {});
      return;
    }

    window.open(audioURL, '_blank');
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

  muteVolume() {
    const { playingTrack } = this;
    this.audioElement.volume = 0;
    this.playingTrack = {
      ...playingTrack,
      volume: 0,
    };
  }

  fullVolume() {
    const { playingTrack } = this;
    this.audioElement.volume = 1;
    this.playingTrack = {
      ...playingTrack,
      volume: 1,
    };
  }

  handleTimeUpdate() {
    if (this.trackEnded) return;

    const { playingTrack } = this;
    const modifiedTrackData = {
      ...playingTrack,
      currentTime: this.audioElement.currentTime,
    };
    this.playingTrack = modifiedTrackData;

    this.checkAndSwitchToNextTrack();
  }

  handlePlayingError() {
    this.publishNotification(
      'error',
      `Yikes! Looks like we can't play this audio as YouTube is restricting us. Sorry about that.`,
      null
    );
  }

  handleMinus10Sec() {
    if (this.audioIsLoading) {
      return;
    }

    const { currentTime } = this.audioElement;
    const { playingTrack } = this;
    let modifiedCurrentTime;

    if (currentTime <= 10) {
      modifiedCurrentTime = 0;
    } else {
      modifiedCurrentTime = currentTime - 10;
    }

    const modifiedTrackData = {
      ...playingTrack,
      currentTime: modifiedCurrentTime,
    };

    this.audioElement.currentTime = modifiedCurrentTime;
    this.playingTrack = modifiedTrackData;
  }

  handlePlus10Sec() {
    if (this.audioIsLoading) {
      return;
    }

    const { currentTime, duration } = this.audioElement;
    const { playingTrack } = this;
    let modifiedCurrentTime;

    if (currentTime + 10 >= duration) {
      modifiedCurrentTime = duration - 1;
    } else {
      modifiedCurrentTime = currentTime + 10;
    }

    const modifiedTrackData = {
      ...playingTrack,
      currentTime: modifiedCurrentTime,
    };

    this.audioElement.currentTime = modifiedCurrentTime;
    this.playingTrack = modifiedTrackData;
  }

  handleKeyInputs(event: KeyboardEvent) {
    if (!this.preventDefaultEnabled || this.audioIsLoading) {
      return;
    }

    event.preventDefault();
    const { which } = event;

    switch (which) {
      case 32:
        this.togglePlayPause();
        break;

      case 65:
        this.handlePrevTrackButtonClick();
        break;

      case 68:
        this.handleNextTrackButtonClick();
        break;

      case 83:
        this.handleRandomButtonClick();
        break;

      case 82:
        this.handleReplayButtonClick();
        break;

      case 37:
        this.handleMinus10Sec();
        break;

      case 39:
        this.handlePlus10Sec();
        break;

      case 191:
        this.ea.publish('openShortcuts', {});
        break;

      default:
        break;
    }
  }

  checkAndSwitchToNextTrack() {
    if (this.audioElement.currentTime >= this.audioElement.duration) {
      this.pauseAudio();
      this.trackEnded = true;

      const currentTracks = this.store.dataStore.getState().nowPlaying.tracks;
      const currentPlayingTrack = this.store.dataStore.getState().player.currentTrack;
      const result: IReturn = getNextTrack(currentTracks, currentPlayingTrack);

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

  publishNotification(eventType: string, message: string, error: object) {
    this.ea.publish('notification', {
      type: eventType,
      message,
      data: error,
    });
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
    this.audioElement.addEventListener('error', this.handlePlayingError.bind(this));

    this.playButton.addEventListener('click', this.handlePlayButtonClick.bind(this));
    this.pauseButton.addEventListener('click', this.handlePauseButtonClick.bind(this));
    this.nextTrackButton.addEventListener('click', this.handleNextTrackButtonClick.bind(this));
    this.prevTrackButton.addEventListener('click', this.handlePrevTrackButtonClick.bind(this));
    this.playlistButton.addEventListener('click', this.handlePlaylistButtonClick.bind(this));
    this.replayButtonNormal.addEventListener('click', this.handleReplayButtonClick.bind(this));
    this.replayButtonRotated.addEventListener('click', this.handleReplayButtonClick.bind(this));
    this.randomButton.addEventListener('click', this.handleRandomButtonClick.bind(this));
    this.downloadButton.addEventListener('click', this.handleDownloadButtonClick.bind(this));

    this.volumeSlider.addEventListener('input', this.handleVolumeSliderChange.bind(this));
    this.volumeOn.addEventListener('click', this.muteVolume.bind(this));
    this.volumeOff.addEventListener('click', this.fullVolume.bind(this));

    this.seekSlider.addEventListener('change', this.handleSeekSliderChange.bind(this));
    this.seekSlider.addEventListener('mousedown', this.pauseAudio.bind(this));
    this.seekSlider.addEventListener('mouseup', this.playAudio.bind(this));

    window.addEventListener('keydown', this.handleKeyInputs.bind(this));
  }

  removeAllEventListeners() {
    this.audioElement.removeEventListener('canplay', this.handleCanPlay);
    this.audioElement.removeEventListener('timeupdate', this.handleTimeUpdate);
    this.audioElement.removeEventListener('error', this.handlePlayingError);

    this.playButton.removeEventListener('click', this.handlePlayButtonClick);
    this.pauseButton.removeEventListener('click', this.handlePauseButtonClick);
    this.nextTrackButton.removeEventListener('click', this.handleNextTrackButtonClick);
    this.prevTrackButton.removeEventListener('click', this.handlePrevTrackButtonClick);
    this.playlistButton.removeEventListener('click', this.handlePlaylistButtonClick);
    this.replayButtonNormal.removeEventListener('click', this.handleReplayButtonClick);
    this.replayButtonRotated.removeEventListener('click', this.handleReplayButtonClick);
    this.randomButton.removeEventListener('click', this.handleRandomButtonClick);
    this.downloadButton.removeEventListener('click', this.handleDownloadButtonClick);

    this.volumeSlider.removeEventListener('input', this.handleVolumeSliderChange);
    this.volumeOn.removeEventListener('click', this.muteVolume);
    this.volumeOff.removeEventListener('click', this.fullVolume);

    this.seekSlider.removeEventListener('change', this.handleSeekSliderChange);
    this.seekSlider.removeEventListener('mousedown', this.pauseAudio);
    this.seekSlider.removeEventListener('mouseup', this.playAudio);

    window.removeEventListener('keypress', this.handleKeyInputs);
  }

  initializeElements() {
    UIkit.grid(this.playerGrid);
  }
}
