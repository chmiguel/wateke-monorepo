import { capture, instance, mock, when, verify, anyFunction } from 'ts-mockito';
import PlaylistRepository from '../core/domain/spots/PlaylistRepository';
import { UserConfig } from '../core/domain/spots/Spot';
import SpotsRepository from '../core/domain/spots/SpotsRepository';
import SettingsBloc from './SettingsBloc';

describe('SettingsBloc should', () => {
  it('render available settings for normal users only if user is not admin', async () => {
    when(spotsRepository.getAvailableSettings()).thenReturn(userSettings);

    presenter.start(false);

    expect(presenter.state.availableSettings.length).toBe(1);
    expect(presenter.state.availableSettings[0].userType).toBe('all');
  });

  it('render available settings for admin users if user is admin', async () => {
    when(spotsRepository.getAvailableSettings()).thenReturn(userSettings);

    presenter.start(true);

    expect(presenter.state.availableSettings.length).toBe(2);
    expect(presenter.state.availableSettings[0].userType).toBe('admin');
  });

  it('subscribe to the spot config and update the state', async () => {
    when(spotsRepository.getAvailableSettings()).thenReturn(userSettings);

    presenter.start(true);

    const [onSpotConfigChangedCallback] = capture(
      spotsRepository.subscribeToSpotConfigUpdates,
    ).last();
    expect(presenter.state.spotConfig.maxPostsPerSpot).toBeUndefined();

    onSpotConfigChangedCallback({
      maxPostsPerSpot: 30,
      isPhotosCarouselEnabled: false,
    });
    expect(presenter.state.spotConfig.maxPostsPerSpot).toBe(30);
  });

  it('update the spot config is user is admin', async () => {
    when(spotsRepository.getAvailableSettings()).thenReturn(userSettings);
    presenter.start(true);

    presenter.updateConfig(15, userSettings[0]);

    verify(spotsRepository.updateSpotSetting(userSettings[0].id, 15)).called();
  });

  it('unsubscribe to spot settings if user is admin and was subscribed', async () => {
    const settingsSubscription = { unsubscribe: jest.fn() };
    when(
      spotsRepository.subscribeToSpotConfigUpdates(anyFunction()),
    ).thenReturn(settingsSubscription);
    when(spotsRepository.getAvailableSettings()).thenReturn(userSettings);
    presenter.start(true);

    presenter.unmount();

    expect(settingsSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('not execute the unsubscribe if user is not admin', async () => {
    const settingsSubscription = { unsubscribe: jest.fn() };
    when(
      spotsRepository.subscribeToSpotConfigUpdates(anyFunction()),
    ).thenReturn(settingsSubscription);
    when(spotsRepository.getAvailableSettings()).thenReturn(userSettings);
    presenter.start(false);

    presenter.unmount();

    expect(settingsSubscription.unsubscribe).not.toHaveBeenCalled();
  });

  beforeEach(() => {
    spotsRepository = mock<SpotsRepository>();
    playlistRepository = mock<PlaylistRepository>();

    presenter = createPresenter();
  });

  function createPresenter(): SettingsBloc {
    return new SettingsBloc(
      instance(spotsRepository),
      instance(playlistRepository),
    );
  }

  let presenter: SettingsBloc;
  let spotsRepository: SpotsRepository;
  let playlistRepository: PlaylistRepository;

  const userSettings: UserConfig[] = [
    {
      title: 'Reproducción simultanea',
      subtitle:
        'Otros dispositivos podran reproducir el playlist en tiempo real',
      type: 'switch',
      id: 'multiplaying',
      userType: 'admin',
    },
    {
      title: 'Autosilenciar reproductor',
      subtitle:
        'Al iniciar la aplicacion el reproductor esta en modo silencioso',
      type: 'switch',
      id: 'autoMute',
      userType: 'all',
    },
  ];
});
