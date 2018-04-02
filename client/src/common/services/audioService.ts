import BaseRequest from './baseRequest';

class AudioService extends BaseRequest {
  getAudioURL = (trackName: string, artistName: string, errorMessage?: string) => {
    return this.getDataFromService(`/audio?track=${trackName}&artist=${artistName}`, errorMessage);
  };
}

export default AudioService;
