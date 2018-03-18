export const LINK_REGEX = /<a(|\s+[^>]+)>.*<\/a(|\s+[^>]+)>/g;

export const BASE_URL: string = 'https://euphonize.herokuapp.com/';

export const TRACK_IMAGE_PLACEHOLDER =
  'https://static.tumblr.com/uqie0nv/1vIn5g72i/default_album_art.png';

export const PLAYLIST_LOCAL_STORAGE = 'playlists';

export const CONTENT_TYPES = {
  USER_CU: 'user_cu',
  BILLBOARD: 'billboard',
};

export const ARTIST_DATA = {
  INFO: 'info',
  SIMILAR: 'similar_artists',
};

export const SELECTION_TYPE = {
  TRACKS: 'tracks',
  ALBUMS: 'albums',
  TAGS: 'tags',
};
