import { ITrackBasic } from './track-interface';

export interface IPlaylist {
  name: string;
  tracks: ITrackBasic[];
}

export interface ISelectablePlaylist {
  selected: boolean;
  name: string;
}

export interface IPlaylistDictionary {
  [name: string]: ITrackBasic[];
}

export interface IPlaylistView {
  name: string;
  totalTracks: number;
  image: string;
}
