import { Cubit } from 'bloc-react';
import { Subscription } from '../domain/DataSubscriptions';
import {
  MusicProvider,
  PublishedSong,
  Song,
  SongVM,
} from '../domain/music/Music';
import PlaylistRepository from '../domain/spots/PlaylistRepository';
import { Config, Spot } from '../domain/spots/Spot';
import SpotsRepository from '../domain/spots/SpotsRepository';
import UserRepository from '../domain/auth/UserRepository';
import PostingBlockedError from '../domain/spots/PostingBlockedError';
import UserPostsMaxReachedError from '../domain/spots/UserPostsMaxReachedError';
import SongsRepository from '../domain/music/SongsRepository';
import SpotPostsMaxReachedError from '../domain/spots/SpotPostsMaxReachedError';
import ToastRepository from '../domain/toasts/ToastRepository';
import DashboardBloc from '../../presenters/DashboardBloc';
import SongFromWrongProviderError from '../domain/spots/SongFromWrongProviderError';

export interface SelectedSpotState {
  config?: Config;
  currentSong?: PublishedSong;
  spot: Spot | null;
  currentPlaylist: PublishedSong[];
  isLoadingPlaylist?: boolean;
}

export enum SelectedSpotEvent {
  SelectedSpotSet = 'SelectedSpotSet',
  SelectedSpotStarted = 'SelectedSpotStarted',
}

const getInitialState = (currentSpot: Spot | null): SelectedSpotState => {
  return {
    currentPlaylist: [],
    config: currentSpot?.config,
    spot: currentSpot,
  };
};

export default class SelectedSpotBloc extends Cubit<SelectedSpotState> {
  dashboardBloc?: DashboardBloc;
  spotsRepository: SpotsRepository;
  playlistRepo: PlaylistRepository;
  userRepository: UserRepository;
  songsRepository: SongsRepository;
  toastsRepository?: ToastRepository;
  currentSongSubscription?: Subscription;
  playlistSubscription?: Subscription;
  nextSongsIdsSubscription?: Subscription;
  spotConfigSubscription?: Subscription;
  adminConnectionId?: string;
  currentSuggestionIndex = 0;
  nextSongsIds: { [songId: string]: boolean } = {};
  rawSongSuggestions: Song[] = [];
  isAddingSongToPlaylist = false;
  musicProviderUpdater?: (musicProvider: MusicProvider) => void;

  constructor(
    spotsRepository: SpotsRepository,
    playlistRepository: PlaylistRepository,
    userRepository: UserRepository,
    songsRepository: SongsRepository,
    toastRepository?: ToastRepository,
    musicProviderUpdater?: (musicProvider: MusicProvider) => void,
  ) {
    super(getInitialState(null));
    this.spotsRepository = spotsRepository;
    this.playlistRepo = playlistRepository;
    this.userRepository = userRepository;
    this.songsRepository = songsRepository;
    this.toastsRepository = toastRepository;
    this.musicProviderUpdater = musicProviderUpdater;
    this.initialize();
  }

  initialize = async () => {
    this.emit({
      ...this.state,
      spot: await this.spotsRepository.getCurrentSpot(),
    });
  };

  private onCurrentSongChanged = (currentSong: PublishedSong) => {
    this.emit({ ...this.state, currentSong });
  };

  private onPlaylistChanged = (playlist: PublishedSong[]) => {
    this.emit({ ...this.state, currentPlaylist: playlist });
  };

  private onSpotConfigChanged = (spotConfig: Config) => {
    const hasMusicProviderChanged =
      spotConfig.provider !== this.state.config?.provider;
    if (hasMusicProviderChanged)
      this.musicProviderUpdater?.(spotConfig.provider || 'deezer');
    this.emit({ ...this.state, config: spotConfig });
    this.spotsRepository.setCurrentSpot({
      ...this.state.spot!,
      config: spotConfig,
    });
  };

  private changeToNextSong = () => {
    const song: PublishedSong = JSON.parse(
      JSON.stringify(this.state.currentPlaylist[0]),
    );
    if (song.song.artistName !== this.state.currentSong?.song.artistName)
      this.dashboardBloc?.loadSuggestionForSong(song.song);
    this.playlistRepo.changeToNextSong(song, !!this.state.config?.playlist);
    this.spotsRepository.setCurrentSpotSong(song);
  };

  private changeToNextSongFromSuggestions = () => {
    const nextSong =
      this.songsRepository.suggestions[this.currentSuggestionIndex];
    this.spotsRepository.setCurrentSpotSong({
      song: nextSong,
      publisher: this.userRepository.user!,
    } as PublishedSong);
    if (this.currentSuggestionIndex > 10) this.currentSuggestionIndex = 0;
    else this.currentSuggestionIndex += 1;
  };

  private getNumberOfSongsPostedByUser = () =>
    this.state.currentPlaylist.reduce(
      (prev, song) =>
        song.publisher.uid === this.userRepository.user?.uid ? prev + 1 : prev,
      0,
    );

  private hasUserPostedMoreThanAllowed = (): boolean =>
    this.getNumberOfSongsPostedByUser() >= this.state.config!.maxPostsPerUser!;

  private hasSpotReachedMaxPosts = (): boolean =>
    this.state.currentPlaylist.length >= this.state.config!.maxPostsPerSpot!;

  private isPostingBlocked = () => this.state.config!.blockPost;

  selectSpot = (spot: Spot) => {
    this.musicProviderUpdater?.(spot.config.provider || 'deezer');
    this.emit({ ...this.state, spot });
    this.spotsRepository.setCurrentSpot(spot);
    this.userRepository.updateUserSelectedSpot({ spotId: spot.id });
  };

  closeSpot = () => {
    if (this.isCurrentUserAdmin()) this.spotsRepository.setOnlineStatus(false);
    this.spotsRepository.setCurrentSpot(null);
    this.emit({ ...this.state, spot: null });
  };

  startSelectedSpot = (dashboardBloc?: DashboardBloc): Spot | null => {
    this.dashboardBloc = dashboardBloc;
    this.currentSongSubscription =
      this.spotsRepository.subscribeToCurrentSongUpdates(
        this.state.spot!.id,
        this.onCurrentSongChanged,
      );
    this.playlistSubscription = this.playlistRepo.subscribeToPlaylistUpdates(
      this.state.spot!.id,
      this.onPlaylistChanged,
    );
    this.spotConfigSubscription =
      this.spotsRepository.subscribeToSpotConfigUpdates(
        this.onSpotConfigChanged,
      );
    if (this.isCurrentUserAdmin()) this.spotsRepository.setOnlineStatus(true);
    return this.state.spot;
  };

  unmount = () => {
    this.currentSongSubscription?.unsubscribe();
    this.playlistSubscription?.unsubscribe();
    this.nextSongsIdsSubscription?.unsubscribe();
    this.spotConfigSubscription?.unsubscribe();
    if (this.isCurrentUserAdmin()) this.spotsRepository.setOnlineStatus(false);
  };

  reactToSong = async (publishedSongId: string, reaction: boolean | null) => {
    // prettier-ignore
    try {
      await this.playlistRepo.reactToSong(publishedSongId, reaction);
    } catch (error: any) {
      this.toastsRepository?.showError(error.message)
    }
  };

  addSongToPlaylist = async (song: SongVM) => {
    // prettier-ignore
    try {
      if(this.isSongFromDifferentProvider(song)) throw new SongFromWrongProviderError();
      if (this.isAddingSongToPlaylist) return;
      this.isAddingSongToPlaylist = true;
      if (this.isCurrentUserAdmin())
        return await this.playlistRepo.addSong(song);
      if (this.isPostingBlocked()) throw new PostingBlockedError();
      if (this.hasUserPostedMoreThanAllowed())
        throw new UserPostsMaxReachedError(
          this.state.config!.maxPostsPerUser as number,
        );
      if (this.hasSpotReachedMaxPosts())
        throw new SpotPostsMaxReachedError(
          this.state.config!.maxPostsPerSpot as number,
        );
      await this.playlistRepo.addSong(song);
    } catch (error: any) {
      this.toastsRepository?.showInfo(error.message)
    } finally {
      this.isAddingSongToPlaylist = false;
    }
  };

  removeSongFromPlaylist = async (
    publishedSongId: string,
    songId: number | string,
  ) => {
    // prettier-ignore
    try {
      await this.playlistRepo.removeSong(publishedSongId, songId);
    } catch (error: any) {
      this.toastsRepository?.showError(error.message)
    }
  };

  isCurrentUserAdmin = () => {
    const userId = this.userRepository.user?.uid;
    if (!userId) return;
    return this.state.spot?.admins?.[userId];
  };

  finishCurrentSongAndChangeToNext = () => {
    if (!this.isCurrentUserAdmin()) return;
    const areThereSongInPlaylist = this.state.currentPlaylist.length > 0;
    if (areThereSongInPlaylist) return this.changeToNextSong();
    const areThereSuggestions = this.songsRepository.suggestions?.length > 0;
    if (areThereSuggestions) this.changeToNextSongFromSuggestions();
  };

  private isSongFromDifferentProvider = (song: SongVM) =>
    song.provider !== this.state.config?.provider;

  prepareCurrentSongToEnd() {
    // todo
  }
}
