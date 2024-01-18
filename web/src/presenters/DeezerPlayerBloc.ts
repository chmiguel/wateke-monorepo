import { Cubit } from 'bloc-react';
import { PlayerProps } from '../core/domain/music/PlayerProps';
import PlayerLoadFailedError from '../core/domain/music/PlayerLoadFailedError';
import PlayerRepository from '../core/domain/music/PlayerRepository';

interface PlayerState {
  isPlaying?: boolean;
  playerSDKLoadProgress?: number;
  shouldShowPlayer: boolean;
  hasPlayerLoaded: boolean;
  hasPlayerLoadFailed: boolean;
  playerLoadAttempts: number;
  isLoggingIn: boolean;
  timeToTryLoadAgain: number;
}

const initialState: PlayerState = {
  shouldShowPlayer: false,
  playerLoadAttempts: 0,
  timeToTryLoadAgain: 0,
  isLoggingIn: false,
  hasPlayerLoaded: false,
  hasPlayerLoadFailed: false,
};

export default class DeezerPlayerBloc extends Cubit<PlayerState> {
  playerRepository: PlayerRepository;
  playerProps?: PlayerProps;
  wasFirstSongPlayed = false;
  timeoutToRetryLoading?: ReturnType<typeof setTimeout>;
  static loadTimeoutInMS = 10000;

  constructor(playerRepository: PlayerRepository) {
    super(initialState);

    this.playerRepository = playerRepository;
  }

  private handleSongEnded = () => {
    this.playerProps?.onSongEnded?.();
  };

  async loadPlayerSDK(initialPlayerProps: PlayerProps) {
    // prettier-ignore
    try {
      await this.playerRepository.loadPlayerSDK(
        (playerSDKLoadProgress: number) => {
          this.emit({ ...this.state, playerSDKLoadProgress });
        },
      );
      this.emit({...this.state, shouldShowPlayer: true})
      if(initialPlayerProps.shouldKeepPlayerHidden) return initialPlayerProps.onPlayerReady?.()
      if(this.isAuthenticatedWithMusicProvider())
        this.initializePlayer()
      
    } catch (error) {
      // TODO handle error
    }
  }

  initializePlayer = async () => {
    try {
      this.emit({ ...this.state, hasPlayerLoadFailed: false });
      await this.playerRepository.initializePlayer(
        DeezerPlayerBloc.loadTimeoutInMS,
      );
      if (this.timeoutToRetryLoading) clearTimeout(this.timeoutToRetryLoading);
      this.emit({ ...this.state, hasPlayerLoaded: true });
      this.playerRepository.setVolume(100);
      this.playerRepository.subscribeToSongEndedEvent(this.handleSongEnded);
      if (this.playerProps?.onPlayerReady) this.playerProps.onPlayerReady();
    } catch (error) {
      if (error instanceof PlayerLoadFailedError) this.handlePlayerLoadFailed();
      this.timeoutToRetryLoading = setTimeout(
        this.initializePlayer,
        this.state.playerLoadAttempts * DeezerPlayerBloc.loadTimeoutInMS,
      );
    }
  };

  handlePlayerLoadFailed = () => {
    const playerLoadAttempts = this.state.playerLoadAttempts + 1;
    this.emit({
      ...this.state,
      hasPlayerLoadFailed: true,
      playerLoadAttempts,
      timeToTryLoadAgain:
        (playerLoadAttempts * DeezerPlayerBloc.loadTimeoutInMS) / 1000,
    });
  };

  start = (props: PlayerProps) => {
    this.playerProps = props;
  };

  setCurrentSong = (songId: string | number) => {
    if (this.wasFirstSongPlayed) this.playerRepository.setCurrentSong(songId);
    else this.playerRepository.setCurrentSong(songId, { autoPlay: false });
    this.wasFirstSongPlayed = true;
  };

  unmount() {
    this.playerRepository.releaseResources();
  }

  authenticateWithMusicProvider = () => {
    this.emit({ ...this.state, isLoggingIn: true });
    this.playerRepository.authenticateWithMusicProvider();
  };

  isAuthenticatedWithMusicProvider = () =>
    this.playerRepository.isAuthenticatedWithMusicProvider();
}
