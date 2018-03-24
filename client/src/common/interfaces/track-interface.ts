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
  tracks: ITrackResponse[];
}

export interface ITrackResponse {
  artist_name: string;
  image: string;
  track_name: string;
}

export interface ITrackDataResponse {
  success: boolean;
  track_data: ITrackData;
}

export interface ITrackData {
  album_name: string;
  artist_name: string;
  image: string;
  published: string;
  summary: string;
  track_name: string;
}

export interface ISimilarTrackResponse {
  similar_tracks: ITrackResponse[];
  success: boolean;
}
