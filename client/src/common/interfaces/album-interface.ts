export interface IAlbumGenreResponse {
  albums: IAlbumGenre[];
  success: boolean;
}

export interface IAlbumGenre {
  album_name: string;
  artist_name: string;
  image: string;
}
