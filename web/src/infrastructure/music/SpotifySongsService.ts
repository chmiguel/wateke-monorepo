import { replaceAccents } from '../../lib/utilities';
import { Song } from '../../core/domain/music/Music';
import SongsService, {
  SuggestedSongsQuery,
} from '../../core/domain/music/SongsService';

declare global {
  interface Window {
    DZ: any;
  }
}

interface ExternalUrls {
  spotify: string;
}

interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface ExternalUrls2 {
  spotify: string;
}

interface Image {
  height: number;
  url: string;
  width: number;
}

interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls2;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

interface ExternalIds {
  isrc: string;
}

interface ExternalUrls4 {
  spotify: string;
}

interface SpotifySong {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls4;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

interface Tracks {
  href: string;
  items: SpotifySong[];
  limit: number;
  next: string;
  offset: number;
  previous?: any;
  total: number;
}

interface SpotifySearchResults {
  tracks: Tracks;
}

const API_URL = process.env.REACT_APP_API_URL;

export default class SpotifySongsService implements SongsService {
  getSuggestedSongs(queryParams: SuggestedSongsQuery): Promise<Song[]> {
    const query = encodeURI(replaceAccents(queryParams.currentSongArtistName)!);
    return fetch(`${API_URL}/spotify/search?text=${query}`)
      .then(response => {
        return response.json();
      })
      .then((results: SpotifySearchResults) => {
        const songs: Song[] = results.tracks.items.map(this.spotifySongToSong);
        return songs;
      });
  }

  searchSongs(searchText: string): Promise<Song[]> {
    return fetch(`${API_URL}/spotify/search?text=${encodeURI(searchText)}`)
      .then(response => response.json())
      .then((results: SpotifySearchResults) => {
        const songs: Song[] = results.tracks.items.map(this.spotifySongToSong);
        return songs;
      });
  }

  private spotifySongToSong = (spotifySong: SpotifySong): Song => ({
    artistName: spotifySong.artists[0]?.name,
    artistPicture: null,
    albumTitle: spotifySong.album.name,
    pictureSmall: spotifySong.album.images[2]?.url,
    pictureMedium: spotifySong.album.images[0].url,
    duration: Math.round(spotifySong.duration_ms / 1000),
    id: spotifySong.uri,
    title: spotifySong.name,
    provider: 'spotify',
    artistId: spotifySong.artists[0].uri,
  });
}
