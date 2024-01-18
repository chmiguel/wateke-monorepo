import { Subscription } from '../DataSubscriptions';

export default interface PlayerService {
  isAuthRequiredToPlay: boolean;
  isAuthenticated?: boolean;

  initializePlayer(timeToRetryInMS?: number): Promise<void | unknown | any>;

  loadSDK(progressCallback?: (progress: number) => void): Promise<void>;

  login(): Promise<void | unknown>;

  logout(): void;

  setCurrentSong(songId: string | number, params?: { autoPlay: boolean }): void;

  play(): Promise<void>;

  seek?(progress: number): Promise<void>;

  pause(): void;

  setVolume(volume: number): void;

  getVolume(): number;

  subscribeToSongEndedEvent(callback: () => void): Subscription;

  subscribeToPlayerStateEvents?(callback: (state: any) => void): Subscription;

  refreshTokenIfNeeded?(): Promise<string>;

  releaseResources(): void;
}
