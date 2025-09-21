import { User } from './core/domain/auth/User';
import UserRepository from './core/domain/auth/UserRepository';
import ConnectivityRepository from './core/domain/connectivity/ConnectivityRepository';
import PlayerRepository from './core/domain/music/PlayerRepository';
import SongsRepository from './core/domain/music/SongsRepository';
import PlaylistRepository from './core/domain/spots/PlaylistRepository';
import SpotsRepository from './core/domain/spots/SpotsRepository';
import FirebaseUserService from './infrastructure/auth/FirebaseUserService';
import LocalStorageUserService from './infrastructure/auth/LocalStorageUserService';
import FirebaseConnectivityService from './infrastructure/connectivity/FirebaseConnectivityService';
import DeezerPlayerService from './infrastructure/music/DeezerPlayerService';
import DeezerSongsService from './infrastructure/music/DeezerSongsService';
import FirebasePlaylistService from './infrastructure/spots/FirebasePlaylistService';
import FirebaseSpotsService from './infrastructure/spots/FirebaseSpotsService';
import InMemorySettingsService from './infrastructure/spots/InMemorySettingsService';
import LocalStorageSpotsService from './infrastructure/spots/LocalStorageSpotsService';
import FirebaseAuthService from './infrastructure/auth/FirebaseAuthService';
import SongsService from './core/domain/music/SongsService';
import YoutubeSongsService from './infrastructure/music/YoutubeSongsService';
import WebToastService from './infrastructure/toasts/WebToastService';
import ToastRepository from './core/domain/toasts/ToastRepository';
import { MusicProvider } from './core/domain/music/Music';
import SpotifySongsService from './infrastructure/music/SpotifySongsService';
import PlayerService from './core/domain/music/PlayerService';
import SpotifyPlayerService from './infrastructure/music/SpotifyPlayerService';
import NavigationService from './core/domain/navigation/NavigationService';
import WebNavigationService from './infrastructure/navigation/WebNavigationService';

export const updateServiceForProvider = (provider: MusicProvider) => {
  switch (provider) {
    case 'youtube':
      songsService = new YoutubeSongsService();
      break;
    case 'spotify':
      songsService = new SpotifySongsService();
      playerService = new SpotifyPlayerService();
      break;
    case 'deezer':
      songsService = new DeezerSongsService();
      playerService = new DeezerPlayerService();
  }
  songsRepository.updateSongsService(songsService);
  playerRepository.updatePlayerService(playerService);
};

let songsService: SongsService = new DeezerSongsService();
let playerService: PlayerService = new DeezerPlayerService();
const songsRepository = new SongsRepository(songsService);
const playerRepository = new PlayerRepository(playerService);

const localStorageSpotsService = new LocalStorageSpotsService();

export class Provider {
  static spotsRepository = () =>
    new SpotsRepository(
      D.localSpotsService(),
      D.remoteSpotsService(),
      D.settingsService(),
    );
  static playerRepository = () => playerRepository;
  static songsRepository = () => songsRepository;
  static playlistRepository = () =>
    new PlaylistRepository(
      D.playlistService(),
      D.localUserService(),
      D.localSpotsService(),
      D.remoteSpotsService(),
    );
  static userRepository = () =>
    new UserRepository(
      D.user(),
      D.localUserService(),
      D.remoteUserService(),
      D.authService(),
    );
  static connectivityRepository = () =>
    new ConnectivityRepository(D.connectivityService());
  static toastRepository = () => new ToastRepository(D.toastService());
  static navigationService = () => D.navigationService();
}

const _singleInstances: { [key: string]: any } = {};

function singleton<T>(name: string, build: () => T): T {
  if (!_singleInstances[name]) {
    _singleInstances[name] = build();
  }
  return _singleInstances[name];
}

class Dependencies {
  static localSpotsService = () =>
    singleton('localSpotsService', () => localStorageSpotsService);

  static remoteSpotsService = () =>
    singleton('remoteSpotsService', () => new FirebaseSpotsService());
  static deezerPlayerService = () =>
    singleton('deezerPlayerService', () => new DeezerPlayerService());
  static songsService = () => singleton('songsService', () => songsService);
  static playlistService = () =>
    singleton('playlistService', () => new FirebasePlaylistService());
  static localUserService = () =>
    singleton('localUserService', () => new LocalStorageUserService());
  static remoteUserService = () =>
    singleton('remoteUserService', () => new FirebaseUserService());
  static user = () => singleton('user', () => new User({}));
  static connectivityService = () =>
    singleton('connectivityService', () => new FirebaseConnectivityService());
  static settingsService = () =>
    singleton('settingsService', () => new InMemorySettingsService());
  static authService = () =>
    singleton('authService', () => new FirebaseAuthService());

  static toastService = () =>
    singleton('toastService', () => new WebToastService());
  static navigationService = () =>
    singleton('navigationService', () => new WebNavigationService());
}

const D = Dependencies;
