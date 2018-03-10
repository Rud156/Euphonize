export interface ISearchResults {
  results: Results;
}

interface Results {
  'opensearch:Query': OpensearchQuery;
  'opensearch:totalResults': string;
  'opensearch:startIndex': string;
  'opensearch:itemsPerPage': string;
  trackmatches: Trackmatches;
  '@attr': Attr;
}

interface Attr {}

interface Trackmatches {
  track: Track[];
}

interface Track {
  name: string;
  artist: string;
  url: string;
  streamable: string;
  listeners: string;
  image: Image[];
  mbid: string;
}

interface Image {
  '#text': string;
  size: string;
}

interface OpensearchQuery {
  '#text': string;
  role: string;
  startPage: string;
}
