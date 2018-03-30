export const LINK_REGEX = /<a(|\s+[^>]+)>.*<\/a(|\s+[^>]+)>/g;

export const BASE_URL: string = 'https://euphonize.herokuapp.com';
// export const BASE_URL: string = 'http://localhost:5000';

export const TRACK_IMAGE_PLACEHOLDER = 'static/images/DefaultAlbumArt.png';

export const PLAYLIST_LOCAL_STORAGE = 'playlists';

export const CONTENT_TYPES = {
  USER_CU: 'user_cu',
  BILLBOARD: 'billboard',
};

export const ARTIST_DATA = {
  INFO: 'info',
  SIMILAR: 'similar_artists',
};

export const TRACK_DATA = {
  INFO: 'info',
  SIMILAR: 'similar_tracks',
};

export const SELECTION_TYPE = {
  TRACKS: 'tracks',
  ALBUMS: 'albums',
  TAGS: 'tags',
};
