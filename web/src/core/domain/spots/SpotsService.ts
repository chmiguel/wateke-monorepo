import { Subscription } from '../DataSubscriptions';
import { PublishedSong } from '../music/Music';
import { Config, Spot, UserConfigValue } from './Spot';

export type CurrentSongCallback = (currentSong: PublishedSong) => void;

export type NextSongsIdsCallback = (nextSongsIds: {
  [songId: string]: boolean;
}) => void;

export type BlockedUsersCallback = (blockedUsers: {
  [userId: string]: boolean;
}) => void;

export type SpotConfigCallback = (config: Config) => void;
export interface LocalSpotsService {
  spot: Spot | null;

  getCurrentSpot(): Promise<Spot | null>;

  setCurrentSpot(spot: Spot | null): void;
}

export interface RemoteSpotsService {
  fetchSpotIsPlayingProp(spotId: string): Promise<boolean>;

  subscribeToCurrentSongUpdates(
    spotId: string,
    callback: CurrentSongCallback,
  ): Subscription;

  subscribeToNextSongsIdsUpdates(
    spotId: string,
    callback: NextSongsIdsCallback,
  ): Subscription;

  removeSongFromNextSongsIds(spotId: string, songId: string): Promise<void>;

  clearNextSongIds(spotId: string): Promise<void>;

  addSongToNextSongsIds(spotId: string, songId: string): Promise<void>;

  subscribeToSpotConfigUpdates(
    spotId: string,
    callback: SpotConfigCallback,
  ): Subscription;

  subscribeToBlockedUsersUpdates(
    spotId: string,
    callback: BlockedUsersCallback,
  ): Subscription;

  getPopularSpots(): Promise<Spot[]>;

  fetchSpot(spotId: string): Promise<Spot>;

  getUserSpots(userId: string): Promise<Spot[]>;

  searchSpots(text: string): Promise<Spot[]>;

  updateSetting(
    spotId: string,
    settingId: string,
    value: UserConfigValue,
  ): Promise<void>;

  setCurrentSong(spotId: string, song: PublishedSong | null): Promise<void>;

  blockUser(spotId: string, userId: string): Promise<void>;

  unblockUser(spotId: string, userId: string): Promise<void>;

  setOnlineStatus(spotId: string, isOnline: boolean): Promise<void>;
}
