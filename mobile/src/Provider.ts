import {User} from '../../web/src/core/domain/auth/User';
import UserRepository from '../../web/src/core/domain/auth/UserRepository';
import FirebaseUserService from './infrastructure/auth/FirebaseUserService';
import FirebaseAuthService from './infrastructure/auth/FirebaseAuthService';
import LocalStorageUserService from './infrastructure/auth/LocalStorageUserService';
import SpotsRepository from '../../web/src/core/domain/spots/SpotsRepository';
import LocalStorageSpotsService from './infrastructure/spots/LocalStorageSpotsService';
import FirebaseSpotsService from './infrastructure/spots/FirebaseSpotsService';
import InMemorySettingsService from './infrastructure/spots/InMemorySettingsService';
import PlaylistRepository from '../../web/src/core/domain/spots/PlaylistRepository';
import FirebasePlaylistService from './infrastructure/spots/FirebasePlaylistService';
import SongsRepository from '../../web/src/core/domain/music/SongsRepository';
import YoutubeSongsService from './infrastructure/music/YoutubeSongsService';
import ConnectivityRepository from '../../web/src/core/domain/connectivity/ConnectivityRepository';
import FirebaseConnectivityService from './infrastructure/connectivity/FirebaseConnectivityService';

// import ConnectivityRepository from '@wateke-core/domain/connectivity/ConnectivityRepository';
// import PlayerRepository from '@wateke-core/domain/music/PlayerRepository';
// import SongsRepository from '@wateke-core/domain/music/SongsRepository';
// import PlaylistRepository from '@wateke-core/domain/spots/PlaylistRepository';
// import SpotsRepository from '@wateke-core/domain/spots/SpotsRepository';
// import FirebaseConnectivityService from './infrastructure/connectivity/FirebaseConnectivityService';
// import DeezerPlayerService from './infrastructure/music/DeezerPlayerService';
// import DeezerSongsService from './infrastructure/music/DeezerSongsService';
// import FirebasePlaylistService from './infrastructure/spots/FirebasePlaylistService';
// import FirebaseSpotsService from './infrastructure/spots/FirebaseSpotsService';
// import InMemorySettingsService from './infrastructure/spots/InMemorySettingsService';
// import LocalStorageSpotsService from './infrastructure/spots/LocalStorageSpotsService';
// import SongsService from '@wateke-core/domain/music/SongsService';
// import YoutubeSongsService from './infrastructure/music/YoutubeSongsService';
// import WebToastService from './infrastructure/toasts/WebToastService';
// import ToastRepository from '@wateke-core/domain/toasts/ToastRepository';
// import {MusicProvider} from '@wateke-core/domain/music/Music';
// import SpotifySongsService from './infrastructure/music/SpotifySongsService';
// import PlayerService from '@wateke-core/domain/music/PlayerService';
// import SpotifyPlayerService from './infrastructure/music/SpotifyPlayerService';

// let songsService: SongsService = new DeezerSongsService();
// let playerService: PlayerService = new DeezerPlayerService();
const songsService = new YoutubeSongsService();
const songsRepository = new SongsRepository(songsService);

const localStorageSpotsService = new LocalStorageSpotsService();

export class Provider {
  static spotsRepository = () =>
    new SpotsRepository(
      D.localSpotsService(),
      D.remoteSpotsService(),
      D.settingsService(),
    );
  // static playerRepository = () => playerRepository;
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
  // static toastRepository = () => new ToastRepository(D.toastService());
}

const _singleInstances: {[key: string]: any} = {};

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
  // static deezerPlayerService = () =>
  //   singleton('deezerPlayerService', () => new DeezerPlayerService());
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

  // static toastService = () =>
  //   singleton('toastService', () => new WebToastService());
}

const D = Dependencies;
