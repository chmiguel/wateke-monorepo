import { Song } from './Music';

export interface SuggestedSongsQuery {
  currentSongArtistName?: string;
  currentSongGenre?: string;
  currentSongName?: string;
  currentSongId?: string | number;
  userId?: string;
}

export default interface SongsService {
  getSuggestedSongs(queryParams: SuggestedSongsQuery): Promise<Song[]>;

  searchSongs(searchText: string): Promise<Song[]>;
}
