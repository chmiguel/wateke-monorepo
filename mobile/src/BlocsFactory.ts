// import DeezerPlayerBloc from './core/blocs/DeezerPlayerBloc';
import SelectedSpotBloc from '../../web/src/core/blocs/SelectedSpotBloc';
import UserBloc from '../../web/src/core/blocs/UserBloc';
import DashboardBloc from './presenters/DashboardBloc';
import SpotsListBloc from './presenters/SpotsListBloc';
// import DashboardBloc from './core/presenters/DashboardBloc';
// import SpotsListBloc from './core/presenters/SpotsListBloc';
// import SettingsBloc from './core/presenters/SettingsBloc';
// import SpotInviteBloc from './core/presenters/SpotInviteBloc';
import {Provider} from './Provider';
// import MySpotsBloc from './core/presenters/MySpotsBloc';
// import SpotifyPlayerBloc from './core/blocs/SpotifyPlayerBloc';

const userRepository = Provider.userRepository();
const songsRepository = Provider.songsRepository();
const spotsRepository = Provider.spotsRepository();
const playlistRepository = Provider.playlistRepository();
// const toastRepository = Provider.toastRepository();

class BlocsFactory {
  static dashboardBloc = (): DashboardBloc =>
    new DashboardBloc(
      songsRepository,
      Provider.connectivityRepository(),
      userRepository,
      spotsRepository,
    );
  static spotsListBloc = (selectedSpotBloc: SelectedSpotBloc): SpotsListBloc =>
    new SpotsListBloc(userRepository, spotsRepository, selectedSpotBloc);
  // static spotInviteBloc = (
  //   userBloc: UserBloc,
  //   selectedSpotBloc: SelectedSpotBloc,
  // ) => new SpotInviteBloc(userBloc, selectedSpotBloc, spotsRepository);

  static spotsBloc = (): SelectedSpotBloc =>
    new SelectedSpotBloc(
      spotsRepository,
      playlistRepository,
      userRepository,
      songsRepository,
      // toastRepository,
    );

  // static deezerPlayerBloc = (): DeezerPlayerBloc =>
  //   new DeezerPlayerBloc(Provider.playerRepository());
  // static spotifyPlayerBloc = (): SpotifyPlayerBloc =>
  //   new SpotifyPlayerBloc(Provider.playerRepository());
  static userBloc = (): UserBloc => new UserBloc(userRepository);
  // static settingsBloc = (): SettingsBloc =>
  //   new SettingsBloc(spotsRepository, playlistRepository);
  // static mySpotsBloc = (selectedSpotBloc: SelectedSpotBloc): MySpotsBloc =>
  //   new MySpotsBloc(spotsRepository, selectedSpotBloc);
}

export {BlocsFactory};

export default BlocsFactory;
