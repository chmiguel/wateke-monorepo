import { Subscription } from '../DataSubscriptions';
import { PublishedSong } from '../music/Music';
import SettingsService from './SettingsService';
import { Spot, UserConfigValue } from './Spot';
import {
  BlockedUsersCallback,
  CurrentSongCallback,
  LocalSpotsService,
  NextSongsIdsCallback,
  RemoteSpotsService,
  SpotConfigCallback,
} from './SpotsService';

export default class SpotsRepository {
  private readonly localSpotsService: LocalSpotsService;
  private readonly remoteSpotsService: RemoteSpotsService;
  private readonly settingsService: SettingsService;

  constructor(
    localSpotsService: LocalSpotsService,
    remoteSpotsService: RemoteSpotsService,
    settingsService: SettingsService,
  ) {
    this.localSpotsService = localSpotsService;
    this.remoteSpotsService = remoteSpotsService;
    this.settingsService = settingsService;
  }

  getCurrentSpot() {
    return this.localSpotsService.getCurrentSpot();
  }

  setCurrentSpot(spot: Spot | null) {
    this.localSpotsService.setCurrentSpot(spot);
  }

  fetchSpot = (spotId: string): Promise<Spot> => {
    return this.remoteSpotsService.fetchSpot(spotId);
  };

  subscribeToCurrentSongUpdates(
    spotId: string,
    callback: CurrentSongCallback,
  ): Subscription {
    return this.remoteSpotsService.subscribeToCurrentSongUpdates(
      spotId,
      callback,
    );
  }

  subscribeToBlockedUsersUpdates(
    spotId: string,
    callback: BlockedUsersCallback,
  ): Subscription {
    return this.remoteSpotsService.subscribeToBlockedUsersUpdates(
      spotId,
      callback,
    );
  }

  subscribeToNextSongsIdsUpdates(
    spotId: string,
    callback: NextSongsIdsCallback,
  ): Subscription {
    return this.remoteSpotsService.subscribeToNextSongsIdsUpdates(
      spotId,
      callback,
    );
  }

  subscribeToSpotConfigUpdates(callback: SpotConfigCallback): Subscription {
    return this.remoteSpotsService.subscribeToSpotConfigUpdates(
      this.localSpotsService.spot!.id!,
      callback,
    );
  }

  setCurrentSpotSong = (song: PublishedSong): Promise<void> => {
    return this.remoteSpotsService.setCurrentSong(
      this.localSpotsService.spot!.id!,
      song,
    );
  };

  blockUser = (userId: string): Promise<void> => {
    return this.remoteSpotsService.blockUser(
      this.localSpotsService.spot!.id!,
      userId,
    );
  };

  unblockUser = (userId: string): Promise<void> => {
    return this.remoteSpotsService.unblockUser(
      this.localSpotsService.spot!.id!,
      userId,
    );
  };

  getAvailableSettings = () => this.settingsService.getAvailableSettings();

  updateSpotSetting = (settingId: string, value: UserConfigValue) => {
    return this.remoteSpotsService.updateSetting(
      this.localSpotsService.spot!.id!,
      settingId,
      value,
    );
  };

  getPopularSpots = (): Promise<Spot[]> => {
    return this.remoteSpotsService.getPopularSpots();
  };

  getUserSpots = (userId: string): Promise<Spot[]> => {
    return this.remoteSpotsService.getUserSpots(userId);
  };

  searchSpots = (text: string): Promise<Spot[]> => {
    return this.remoteSpotsService.searchSpots(text);
  };

  removeCurrentSong() {
    this.remoteSpotsService.setCurrentSong(
      this.localSpotsService.spot!.id!,
      null,
    );
  }

  setOnlineStatus(isOnline: boolean) {
    this.remoteSpotsService.setOnlineStatus(
      this.localSpotsService.spot!.id!,
      isOnline,
    );
  }
}
