export interface ITrackBasic {
  trackName: string;
  artistName: string;
  image: string;
}

export interface ITrack extends ITrackBasic {
  id: number;
}

export interface ITrackGenreResponse {
  success: boolean;
  tracks: ITrackGenre[];
}

export interface ITrackGenre {
  artist_name: string;
  image: string;
  track_name: string;
}
