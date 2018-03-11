export interface ISearchResults {
  success: boolean;
  message?: string;
  result: ISearchData;
}

interface ISearchData {
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
  image: IImage[];
  mbid: string;
}

export interface IImage {
  '#text': string;
  size: string;
}

interface OpensearchQuery {
  '#text': string;
  role: string;
  startPage: string;
}
