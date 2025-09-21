import DeezerPlayerBloc from './presenters/DeezerPlayerBloc';
import SelectedSpotBloc from './core/blocs/SelectedSpotBloc';
import UserBloc from './core/blocs/UserBloc';
import DashboardBloc from './presenters/DashboardBloc';
import SpotsListBloc from './presenters/SpotsListBloc';
import SettingsBloc from './presenters/SettingsBloc';
import SpotInviteBloc from './presenters/SpotInviteBloc';
import { Provider, updateServiceForProvider } from './Provider';
import MySpotsBloc from './presenters/MySpotsBloc';
import SpotifyPlayerBloc from './presenters/SpotifyPlayerBloc';

const userRepository = Provider.userRepository();
const songsRepository = Provider.songsRepository();
const spotsRepository = Provider.spotsRepository();
const playlistRepository = Provider.playlistRepository();
const toastRepository = Provider.toastRepository();
const navigationService = Provider.navigationService();

class BlocsFactory {
  static dashboardBloc = (): DashboardBloc =>
    new DashboardBloc(
      songsRepository,
      Provider.connectivityRepository(),
      userRepository,
      spotsRepository,
    );
  static spotsListBloc = (selectedSpotBloc: SelectedSpotBloc): SpotsListBloc =>
    new SpotsListBloc(userRepository, spotsRepository, selectedSpotBloc, navigationService);
  static spotInviteBloc = (
    userBloc: UserBloc,
    selectedSpotBloc: SelectedSpotBloc,
  ) => new SpotInviteBloc(userBloc, selectedSpotBloc, spotsRepository, navigationService);

  static spotsBloc = (): SelectedSpotBloc =>
    new SelectedSpotBloc(
      spotsRepository,
      playlistRepository,
      userRepository,
      songsRepository,
      toastRepository,
      updateServiceForProvider,
    );

  static deezerPlayerBloc = (): DeezerPlayerBloc =>
    new DeezerPlayerBloc(Provider.playerRepository());
  static spotifyPlayerBloc = (): SpotifyPlayerBloc =>
    new SpotifyPlayerBloc(Provider.playerRepository());
  static userBloc = (): UserBloc => new UserBloc(userRepository);
  static settingsBloc = (): SettingsBloc =>
    new SettingsBloc(spotsRepository, playlistRepository);
  static mySpotsBloc = (selectedSpotBloc: SelectedSpotBloc): MySpotsBloc =>
    new MySpotsBloc(spotsRepository, selectedSpotBloc, navigationService);
}

export { BlocsFactory };

export default BlocsFactory;
