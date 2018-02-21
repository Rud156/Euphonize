import { HttpClient } from 'aurelia-fetch-client';
import { BASE_URL, SELECTION_TYPE } from '../utils/constants';

class TrackService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  getTopTracks = (trackType: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/top_tracks?type=${trackType}`)
      .then(response => response.json());
  };

  getTopTrendingTracks = () => {
    return this.httpClient.fetch(`${BASE_URL}/top_trending`).then(response => response.json());
  };

  getArtistTopTracks = (artistName: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/artist_top?name=${artistName}&type=${SELECTION_TYPE.TRACKS}`)
      .then(response => response.json());
  };

  getTracksForTag = (tagName: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/popular_genre?type=${SELECTION_TYPE.TRACKS}&tag_name=${tagName}`)
      .then(response => response.json());
  };

  getFakeTracks = () => {
    return {
      success: true,
      tracks: [
        {
          artist_name: 'Camila Cabello',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/e536d25a497fd2483361a5da1b9d7321.png',
          track_name: 'Havana',
        },
        {
          artist_name: 'Dua Lipa',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/e360f4bd7ed546dff40b32b6d578b75a.png',
          track_name: 'New Rules',
        },
        {
          artist_name: 'Portugal. The Man',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/b86f528d1b5b232274a0ceff02c02626.png',
          track_name: 'Feel It Still',
        },
        {
          artist_name: 'Kendrick Lamar',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/fa53efb99b075d4f4d59bb8969500b5a.png',
          track_name: 'HUMBLE.',
        },
        {
          artist_name: 'Post Malone',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/75c914daed6230294cb7431035e64cf5.png',
          track_name: 'Rockstar',
        },
        {
          artist_name: 'Camila Cabello',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/e536d25a497fd2483361a5da1b9d7321.png',
          track_name: 'Never Be The Same',
        },
        {
          artist_name: 'Bruno Mars',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/85ebe2bcd85fec1c35c571509aa27d1a.png',
          track_name: 'Finesse (Remix) [feat. Cardi B]',
        },
        {
          artist_name: 'Ed Sheeran',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/fa36962445080a3357cd1585fd2cb474.png',
          track_name: 'Shape of You',
        },
        {
          artist_name: 'Kendrick Lamar',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/fa53efb99b075d4f4d59bb8969500b5a.png',
          track_name: 'All The Stars (with SZA)',
        },
        {
          artist_name: 'Dua Lipa',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/e360f4bd7ed546dff40b32b6d578b75a.png',
          track_name: 'IDGAF',
        },
        {
          artist_name: 'Drake',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/bca2998868d2a7ab137b5c575e920e6a.png',
          track_name: "God's Plan",
        },
        {
          artist_name: 'Justin Timberlake',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/f086786f998f01052fe5b3090e8ffacd.png',
          track_name: 'Filthy',
        },
        {
          artist_name: 'Selena Gomez',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/3eeaf0c006b9dcf74d1f7ec212962bc1.png',
          track_name: 'Wolves',
        },
        {
          artist_name: 'The Cranberries',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/a3ac0eebe314405fb19ca5fb6640e500.png',
          track_name: 'Zombie',
        },
        {
          artist_name: 'Troye Sivan',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/b703fbc71ce6659dafb1c9b6e42b18e7.png',
          track_name: 'My My My!',
        },
        {
          artist_name: 'Imagine Dragons',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/8fc8476bfd161bcc4a568f3639c9a2bb.png',
          track_name: 'Thunder',
        },
        {
          artist_name: 'Eminem',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/87ee5102ed5f4e228a44c35461ac336a.png',
          track_name: 'River (feat. Ed Sheeran)',
        },
        {
          artist_name: 'Kendrick Lamar',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/fa53efb99b075d4f4d59bb8969500b5a.png',
          track_name: 'DNA.',
        },
        {
          artist_name: 'Lorde',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/8987fadfc88af0db542ac2f711969c59.png',
          track_name: 'Green Light',
        },
        {
          artist_name: 'Arctic Monkeys',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/81d5e41b894042efb6798ea312878612.png',
          track_name: 'Do I Wanna Know?',
        },
        {
          artist_name: 'Camila Cabello',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/e536d25a497fd2483361a5da1b9d7321.png',
          track_name: 'She Loves Control',
        },
        {
          artist_name: 'Camila Cabello',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/e536d25a497fd2483361a5da1b9d7321.png',
          track_name: 'Real Friends',
        },
        {
          artist_name: 'Ed Sheeran',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/fa36962445080a3357cd1585fd2cb474.png',
          track_name: 'Perfect',
        },
        {
          artist_name: 'Childish Gambino',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/2b087c08d34e4f019b4c4df274d4ae2b.png',
          track_name: 'Redbone',
        },
        {
          artist_name: 'The Cranberries',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/a3ac0eebe314405fb19ca5fb6640e500.png',
          track_name: 'Linger',
        },
        {
          artist_name: 'The Killers',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/6583c8519c5393cbfdaf860f8bf6d68a.png',
          track_name: 'Mr. Brightside',
        },
        {
          artist_name: 'Taylor Swift',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/747a5e4059680d32e0b4eeff94b2960c.png',
          track_name: 'Look What You Made Me Do',
        },
        {
          artist_name: 'Rita Ora',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/509841fb13e514c700d2839ebe985db0.png',
          track_name: 'Anywhere',
        },
        {
          artist_name: 'Tame Impala',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/12a2bbc58ad344fab891686d6eb88889.png',
          track_name: 'The Less I Know the Better',
        },
        {
          artist_name: 'Nirvana',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/6ff086c6ec0a8d50882bd4aac46cd3d2.png',
          track_name: 'Smells Like Teen Spirit',
        },
        {
          artist_name: 'Maroon 5',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/ecaf025cbd3b482bbd5dbdbcb4fc7cf0.png',
          track_name: 'What Lovers Do (feat. SZA)',
        },
        {
          artist_name: 'NF',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/60989d7264254d230f04266930cc5a07.png',
          track_name: 'Let You Down',
        },
        {
          artist_name: 'The White Stripes',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/60340530a58543ca99178c4ec776efcd.png',
          track_name: 'Seven Nation Army',
        },
        {
          artist_name: 'Imagine Dragons',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/8fc8476bfd161bcc4a568f3639c9a2bb.png',
          track_name: 'Believer',
        },
        {
          artist_name: 'LIL UZI VERT',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/b554d07e2cdaefa48e816ca453cf84ff.png',
          track_name: 'XO TOUR Llif3',
        },
        {
          artist_name: 'G-Eazy',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/de48d28e9ca83125b69ecce69ee0ea0f.png',
          track_name: 'Him & I (with Halsey)',
        },
        {
          artist_name: 'Marshmello',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/a89459d5fcd3a73f367708c194c285f4.png',
          track_name: 'Silence',
        },
        {
          artist_name: 'Radiohead',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/97a3e5ec1a56662d6100a02343944c95.png',
          track_name: 'Creep',
        },
        {
          artist_name: 'Clean Bandit',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/9b78b1478ebf271f2db3448c490ee8fa.png',
          track_name: 'I Miss You (feat. Julia Michaels)',
        },
        {
          artist_name: 'Toto',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/cad95a4741ad48fdaf52effde337d910.png',
          track_name: 'Africa',
        },
        {
          artist_name: 'Lil Pump',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/2179ece7e9acc448f46e3065d1cdcca2.png',
          track_name: 'Gucci Gang',
        },
        {
          artist_name: 'Kendrick Lamar',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/fa53efb99b075d4f4d59bb8969500b5a.png',
          track_name: 'LOVE. FEAT. ZACARI.',
        },
        {
          artist_name: 'Foster the People',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/72d59d9ba9b0c8d86df67e8096379d78.png',
          track_name: 'Pumped Up Kicks',
        },
        {
          artist_name: 'a-ha',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/82e8799ebe724258c2051d1f83a11da3.png',
          track_name: 'Take on Me',
        },
        {
          artist_name: 'Hailee Steinfeld',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/b5f832fff8ba20f3674696c274d4f465.png',
          track_name: 'Let Me Go (with Alesso, Florida Georgia Line & watt)',
        },
        {
          artist_name: 'Luis Fonsi',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/86baaeed168d06acfe122532e6e07850.png',
          track_name: 'Échame La Culpa',
        },
        {
          artist_name: 'Camila Cabello',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/e536d25a497fd2483361a5da1b9d7321.png',
          track_name: 'All These Years',
        },
        {
          artist_name: 'Cardi B',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/3d34a1be7f523220383bf9160cde27cd.png',
          track_name: 'Bartier Cardi (feat. 21 Savage)',
        },
        {
          artist_name: 'Sam Smith',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/4cd2f11e4a03462481111f8697a08818.png',
          track_name: 'Too Good at Goodbyes',
        },
        {
          artist_name: 'Post Malone',
          image:
            'https://lastfm-img2.akamaized.net/i/u/300x300/75c914daed6230294cb7431035e64cf5.png',
          track_name: 'I Fall Apart',
        },
      ],
    };
  };
}

export default TrackService;
