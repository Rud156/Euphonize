export interface IAlbumGenreResponse {
  albums: IAlbumData[];
  success: boolean;
}

export interface IAlbumData {
  album_name: string;
  artist_name: string;
  image: string;
}

export interface IAlbumResponse {
  album_data: IAlbumData;
  success: boolean;
}

export interface IAlbumData {
  album_name: string;
  artist_name: string;
  image: string;
  summary: string;
  tracks: string[];
}

export interface ITopAlbumResponse {
  albums: IAlbumData[];
  success: boolean;
}
