import PlayerLoadFailedError from './PlayerLoadFailedError';
import PlayerService from './PlayerService';

export default class PlayerRepository {
  private playerService: PlayerService;

  constructor(playerService: PlayerService) {
    this.playerService = playerService;
  }

  updatePlayerService(playerService: PlayerService) {
    this.playerService = playerService;
  }

  loadPlayerSDK = async (progressCallback?: (progress: number) => void) => {
    await this.playerService.loadSDK(progressCallback);
  };

  isAuthenticatedWithMusicProvider = () => this.playerService.isAuthenticated;

  initializePlayer = async (loadTimeoutInMS: number) => {
    try {
      const result = await this.playerService.initializePlayer(loadTimeoutInMS);
      return result;
    } catch (error) {
      throw new PlayerLoadFailedError();
    }
  };

  authenticateWithMusicProvider = async () => {
    await this.playerService.login();
  };

  setCurrentSong = (songId: string | number, params = { autoPlay: true }) => {
    this.playerService.setCurrentSong(songId, params);
  };

  subscribeToSongEndedEvent = (callback: () => void) =>
    this.playerService.subscribeToSongEndedEvent(callback);

  subscribeToPlayerStateEvents = (callback: (state: any) => void) =>
    this.playerService.subscribeToPlayerStateEvents?.(callback);

  setVolume(volume: number) {
    this.playerService.setVolume(volume);
  }

  play = () => {
    return this.playerService.play();
  };

  seek = (progressToSeek: number) => {
    return this.playerService.seek?.(progressToSeek);
  };

  refreshTokenIfNeeded = () => {
    return this.playerService.refreshTokenIfNeeded?.();
  };

  pause = () => {
    this.playerService.pause();
  };

  releaseResources = () => {
    this.playerService.releaseResources();
  };
}
