import { User } from '../auth/User';
import { Subscription } from '../DataSubscriptions';
import { PublishedSong, Song } from '../music/Music';

export type PlaylistCallback = (playlist: PublishedSong[]) => void;

export default interface PlaylistService {
  subscribeToPlaylistUpdates(
    spotId: string,
    callback: PlaylistCallback,
  ): Subscription;

  reactToSong(
    publishedSongId: string,
    reaction: boolean | null,
    user: User,
    spotId: string,
  ): Promise<void>;

  addSong(spotId: string, song: Song, user: User): Promise<void>;

  clearPlaylist(spotId: string): Promise<void>;

  resetPublishedSong(spotId: string, song: PublishedSong): Promise<void>;

  removeSong(spotId: string, publishedSongId: string): Promise<void>;
}
