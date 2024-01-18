import { Song } from './Music';
import SongsService from './SongsService';

export default class SongsRepository {
  private songsService: SongsService;
  suggestions: Song[] = [];

  constructor(SongsService: SongsService) {
    this.songsService = SongsService;
  }

  updateSongsService(songsService: SongsService) {
    this.songsService = songsService;
  }

  getSuggestedSongs = async (
    currentSongArtistName: string,
    currentSongId: string | number,
  ): Promise<Song[]> => {
    try {
      const songs = await this.songsService.getSuggestedSongs({
        currentSongArtistName,
        currentSongId,
      });
      this.suggestions = songs;
      return songs;
    } catch (error) {
      throw new Error('UnexpectedError');
    }
  };

  searchSongs = async (searchText: string): Promise<Song[]> => {
    try {
      const songs = await this.songsService.searchSongs(searchText);
      return songs;
    } catch (error) {
      throw new Error('UnexpectedError');
    }
  };
}
