import { LocalUserService } from '../auth/UserService';
import { Subscription } from '../DataSubscriptions';
import { PublishedSong, Song } from '../music/Music';
import PermissionDeniedError from './PermissionDeniedError';
import PlaylistService, { PlaylistCallback } from './PlaylistService';
import { LocalSpotsService, RemoteSpotsService } from './SpotsService';

export default class PlaylistRepository {
  private readonly playlistService: PlaylistService;
  private readonly userService: LocalUserService;
  private readonly localSpotsService: LocalSpotsService;
  private readonly remoteSpotsService: RemoteSpotsService;

  constructor(
    playlistService: PlaylistService,
    userService: LocalUserService,
    localSpotsService: LocalSpotsService,
    remoteSpotsService: RemoteSpotsService,
  ) {
    this.playlistService = playlistService;
    this.userService = userService;
    this.localSpotsService = localSpotsService;
    this.remoteSpotsService = remoteSpotsService;
  }

  subscribeToPlaylistUpdates(
    spotId: string,
    callback: PlaylistCallback,
  ): Subscription {
    return this.playlistService.subscribeToPlaylistUpdates(spotId, callback);
  }

  async reactToSong(publishedSongId: string, reaction: boolean | null) {
    // prettier-ignore
    try {
      await this.playlistService.reactToSong(
        publishedSongId,
        reaction,
        this.userService.user!,
        this.localSpotsService.spot!.id!,
      );
    } catch (error: any) {
      if (error.code === 'PERMISSION_DENIED') throw new PermissionDeniedError();
    }
  }

  async addSong(song: Song) {
    // prettier-ignore
    try {
      this.remoteSpotsService.addSongToNextSongsIds(
        this.localSpotsService.spot!.id!,
        song.id.toString(),
      );
      await this.playlistService.addSong(
        this.localSpotsService.spot!.id!,
        song,
        this.userService.user!,
      );
    } catch (error: any) {
      if (error.code === 'PERMISSION_DENIED') throw new PermissionDeniedError();
    }
  }

  async removeSong(publishedSongId: string, songId: number | string) {
    // prettier-ignore
    try {
      await this.playlistService.removeSong(
        this.localSpotsService.spot!.id!,
        publishedSongId,
      );
      await this.remoteSpotsService.removeSongFromNextSongsIds(
        this.localSpotsService.spot!.id!,
        songId.toString(),
      );
    } catch (error: any) {
      if (error.code === 'PERMISSION_DENIED') throw new PermissionDeniedError();
    }
  }

  changeToNextSong = async (
    publishedSong: PublishedSong,
    shouldPreservePlaylist: boolean,
  ): Promise<void> => {
    if (shouldPreservePlaylist)
      await this.playlistService.resetPublishedSong(
        this.localSpotsService.spot!.id!,
        publishedSong,
      );
    else
      await this.playlistService.removeSong(
        this.localSpotsService.spot!.id!,
        publishedSong.id,
      );
    await this.remoteSpotsService.removeSongFromNextSongsIds(
      this.localSpotsService.spot!.id!,
      publishedSong.song.id.toString(),
    );
  };

  async clearPlaylist() {
    await this.playlistService.clearPlaylist(this.localSpotsService.spot!.id!);
    await this.remoteSpotsService.clearNextSongIds(
      this.localSpotsService.spot!.id!,
    );
  }
}
