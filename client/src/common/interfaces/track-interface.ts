export interface ITrackBasic {
  trackName: string;
  artistName: string;
  image: string;
}

export interface ITrack extends ITrackBasic {
  id: number;
}
