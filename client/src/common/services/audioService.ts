import { HttpClient } from 'aurelia-fetch-client';
import { BASE_URL } from '../utils/constants';

class AudioService {
  httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  getAudioURL = (trackName: string, artistName: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/audio?track${trackName}&artist=${artistName}`)
      .then(response => response.json());
  };
}

export default AudioService;
