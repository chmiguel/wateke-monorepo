import { Cubit } from 'bloc-react';
import { Subscription } from '../core/domain/DataSubscriptions';
import PlaylistRepository from '../core/domain/spots/PlaylistRepository';
import { UserConfigValue, UserConfig, Config } from '../core/domain/spots/Spot';
import SpotsRepository from '../core/domain/spots/SpotsRepository';
import { updateServiceForProvider } from '../Provider';

interface SettingsState {
  availableSettings: UserConfig[];
  spotConfig: Config;
}

export default class SettingsBloc extends Cubit<SettingsState> {
  private spotsRepository: SpotsRepository;
  private playlistRepository: PlaylistRepository;
  private spotConfigSubscription?: Subscription;
  private isCurrentUserAdmin = false;

  constructor(
    spotsRepository: SpotsRepository,
    playlistRepository: PlaylistRepository,
  ) {
    super({
      availableSettings: [],
      spotConfig: { isPhotosCarouselEnabled: false },
    });
    this.spotsRepository = spotsRepository;
    this.playlistRepository = playlistRepository;
  }

  private onSpotConfigChanged = (spotConfig: Config) => {
    this.emit({ ...this.state, spotConfig });
  };

  private filterAvailableSettingsByUserType = (
    settings: UserConfig[],
  ): UserConfig[] => {
    return settings.filter(
      item => this.isCurrentUserAdmin || item.userType === 'all',
    );
  };

  private initializeAvailableSettings = () =>
    this.emit({
      ...this.state,
      availableSettings: this.filterAvailableSettingsByUserType(
        this.spotsRepository.getAvailableSettings(),
      ),
    });

  start = (isCurrentUserAdmin: boolean) => {
    this.isCurrentUserAdmin = isCurrentUserAdmin;
    this.initializeAvailableSettings();
    if (isCurrentUserAdmin)
      this.spotConfigSubscription =
        this.spotsRepository.subscribeToSpotConfigUpdates(
          this.onSpotConfigChanged,
        );
  };

  unmount = () => {
    this.spotConfigSubscription?.unsubscribe();
  };

  updateConfig = async (
    newConfigValue: UserConfigValue,
    configItem: UserConfig,
  ) => {
    if (this.isCurrentUserAdmin) {
      this.spotsRepository.updateSpotSetting(configItem.id, newConfigValue);
      if (configItem.id === 'provider') {
        await this.spotsRepository.removeCurrentSong();
        await this.playlistRepository.clearPlaylist();
        updateServiceForProvider(newConfigValue as 'youtube' | 'deezer');
        window.location.reload();
      }
    }
  };
}
