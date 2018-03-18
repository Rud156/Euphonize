export interface ISimilarArtistsRawData {
  similar_artists: ISimilarArtist[];
  success: boolean;
}

export interface IArtistInfoRawData {
  artist_data: IArtistData;
  success: boolean;
}

export interface IArtistData {
  artist_name: string;
  image: string;
  similar_artists: ISimilarArtist[];
  summary: string;
}

export interface ISimilarArtist {
  artist_name: string;
  image: string;
}

export interface IArtistTopTracks {
  artist_tracks: string[];
  success: boolean;
}
