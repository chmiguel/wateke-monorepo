import { Cubit } from 'bloc-react';
import { PlayerProps } from '../core/domain/music/PlayerProps';
import PlayerRepository from '../core/domain/music/PlayerRepository';
import { CallbackState } from 'react-spotify-web-playback';

interface PlayerState {
  isPlaying?: boolean;
  isLoadingTrack: boolean;
  playerSDKLoadProgress?: number;
  shouldShowPlayer: boolean;
  hasPlayerLoaded: boolean;
  hasPlayerLoadFailed: boolean;
  playerLoadAttempts: number;
  isLoggingIn: boolean;
  timeToTryLoadAgain: number;
  accessToken?: string | null;
  currentTrackProgressPercentage: number;
  currentTrackProgress: number;
  currentTrackDuration?: number;
}

const initialState: PlayerState = {
  shouldShowPlayer: false,
  playerLoadAttempts: 0,
  timeToTryLoadAgain: 0,
  isLoggingIn: false,
  hasPlayerLoaded: false,
  hasPlayerLoadFailed: false,
  isLoadingTrack: false,
  isPlaying: false,
  currentTrackProgressPercentage: 0,
  currentTrackProgress: 0,
};

const PROGRESS_UPDATE_RATE_IN_MS = 500;

export default class SpotifyPlayerBloc extends Cubit<PlayerState> {
  playerRepository: PlayerRepository;
  playerProps?: PlayerProps;
  wasFirstSongPlayed = false;
  private isSongInLastSeconds = false;
  private trackProgressInterval?: ReturnType<typeof setInterval>;
  timeoutToRetryLoading?: ReturnType<typeof setTimeout>;
  static loadTimeoutInMS = 10000;

  constructor(playerRepository: PlayerRepository) {
    super(initialState);

    this.playerRepository = playerRepository;
  }

  private handleSongEnded = () => {
    this.playerProps?.onSongEnded?.();
  };

  initializePlayer = async () => {
    this.emit({ ...this.state, hasPlayerLoadFailed: false });
    await this.playerRepository.loadPlayerSDK();
    const accessToken: string = await this.playerRepository.initializePlayer(
      SpotifyPlayerBloc.loadTimeoutInMS,
    );
    this.playerRepository.subscribeToPlayerStateEvents(
      this.handlePlayerStateChanged,
    );
    if (this.timeoutToRetryLoading) clearTimeout(this.timeoutToRetryLoading);
    this.emit({ ...this.state, hasPlayerLoaded: true, accessToken });
  };

  handlePlayerLoadFailed = () => {
    const playerLoadAttempts = this.state.playerLoadAttempts + 1;
    this.emit({
      ...this.state,
      hasPlayerLoadFailed: true,
      playerLoadAttempts,
      timeToTryLoadAgain:
        (playerLoadAttempts * SpotifyPlayerBloc.loadTimeoutInMS) / 1000,
    });
  };

  handlePlayerStateChanged = async (state: any) => {
    if (!this.isSongInLastSeconds)
      this.isSongInLastSeconds = state.duration - state.position <= 10000;
    const hasEndedPlaying =
      state.position === state.duration ||
      (this.isSongInLastSeconds && state.position === 0 && state.paused);
    this.emit({
      ...this.state,
      isPlaying: !state.paused,
      isLoadingTrack: state.loading,
      currentTrackProgressPercentage: this.calculateProgressPercentage(
        state.position,
        state.duration,
      ),
      currentTrackProgress: state.position,
      currentTrackDuration: state.duration,
    });
    if ((state.paused || state.loading) && this.trackProgressInterval) {
      clearInterval(this.trackProgressInterval);
      this.trackProgressInterval = undefined;
    } else if (!this.trackProgressInterval) {
      this.trackProgressInterval = setInterval(
        this.increaseProgress,
        PROGRESS_UPDATE_RATE_IN_MS,
      );
    }
    if (hasEndedPlaying) {
      this.isSongInLastSeconds = false;
      this.playerProps?.onSongEnded?.();
    }
    if (state.error) this.handlePlayerError(state);
  };

  private handlePlayerError(state: CallbackState) {
    if (state.errorType === 'authentication_error') {
      this.initializePlayer();
    }
  }

  private calculateProgressPercentage = (
    trackProgress: number,
    trackDuration: number,
  ) => {
    if (!trackDuration || !trackProgress) return 0;
    return (trackProgress / trackDuration) * 100;
  };

  refreshTokenIfNeeded = () => this.playerRepository.refreshTokenIfNeeded();

  start = (props: PlayerProps) => {
    this.playerProps = props;
  };

  setCurrentSong = (songId: string | number) => {
    this.isSongInLastSeconds = false;
    if (this.wasFirstSongPlayed) this.playerRepository.setCurrentSong(songId);
    else this.playerRepository.setCurrentSong(songId, { autoPlay: false });
    this.wasFirstSongPlayed = true;
  };

  togglePlay = async () => {
    try {
      this.emit({
        ...this.state,
        isLoadingTrack: !this.state.isPlaying && !this.state.isLoadingTrack,
      });
      await this.playerRepository.play();
    } catch (error) {
      this.emit({
        ...this.state,
        isLoadingTrack: false,
      });
    }
  };

  pause = () => {
    this.playerRepository.pause();
  };

  seekToProgress = () => {
    const newProgress =
      (this.state.currentTrackProgressPercentage / 100) *
      (this.state.currentTrackDuration || 0);
    this.playerRepository.seek(newProgress);
  };

  updateProgress = (progressPercentage: number) => {
    this.emit({
      ...this.state,
      currentTrackProgressPercentage: progressPercentage,
    });
  };

  private increaseProgress = () => {
    const { currentTrackProgressPercentage, currentTrackDuration } = this.state;
    const currentProgress =
      (currentTrackProgressPercentage / 100) * currentTrackDuration!;
    const newProgress = currentProgress + PROGRESS_UPDATE_RATE_IN_MS;
    const newProgressPercentage = (newProgress / currentTrackDuration!) * 100;
    this.emit({
      ...this.state,
      currentTrackProgressPercentage: newProgressPercentage,
    });
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
