import { Song } from '../../core/domain/music/Music';
import SongsService, {
  SuggestedSongsQuery,
} from '../../core/domain/music/SongsService';

declare global {
  interface Window {
    DZ: any;
  }
}

interface DeezerSong {
  album: Album;
  artist: Artist;
  duration: number;
  explicit_content_cover: number;
  explicit_content_lyrics: number;
  explicit_lyrics: boolean;
  id: number;
  link: string;
  md5_image: string;
  preview: string;
  rank: number;
  readable: boolean;
  title: string;
  title_short: string;
  type: string;
  title_version?: string;
}

interface Album {
  cover: string;
  cover_big: string;
  cover_medium: string;
  cover_small: string;
  cover_xl: string;
  id: number;
  md5_image: string;
  title: string;
  tracklist: string;
  type: string;
}

interface Artist {
  id: number;
  link: string;
  name: string;
  picture: string;
  picture_big: string;
  picture_medium: string;
  picture_small: string;
  picture_xl: string;
  tracklist: string;
  type: string;
}

export default class DeezerSongsService implements SongsService {
  getSuggestedSongs(queryParams: SuggestedSongsQuery): Promise<Song[]> {
    return new Promise(resolve => {
      const query = queryParams.currentSongArtistName;
      window.DZ.api(`/search?q=${query}`, (data: { data: DeezerSong[] }) => {
        resolve(data.data.map(this.deezerSongToSong));
      });
    });
  }

  searchSongs(searchText: string): Promise<Song[]> {
    return new Promise(resolve => {
      window.DZ.api(
        `/search?q=${searchText}`,
        (data: { data: DeezerSong[] }) => {
          resolve(data.data.map(this.deezerSongToSong));
        },
      );
    });
  }

  private deezerSongToSong = (deezerSong: DeezerSong): Song => ({
    artistName: deezerSong.artist.name,
    artistPicture: deezerSong.artist.picture_medium,
    albumTitle: deezerSong.album.title,
    pictureSmall: deezerSong.album.cover_medium,
    pictureMedium: deezerSong.album.cover_big,
    duration: deezerSong.duration,
    id: deezerSong.id,
    title: deezerSong.title,
    provider: 'deezer',
  });
}
