import { Cubit } from 'bloc-react';
import { SpotUserVM, User } from '../core/domain/auth/User';
import UserRepository from '../core/domain/auth/UserRepository';
import { ReplyPayload } from '../core/domain/chat/Chat';
import ConnectivityRepository from '../core/domain/connectivity/ConnectivityRepository';
import { Subscription } from '../core/domain/DataSubscriptions';
import { PublishedSong, Song, SongVM } from '../core/domain/music/Music';
import MusicDurationFormatter from '../core/domain/music/MusicDurationParser';
import SongsRepository from '../core/domain/music/SongsRepository';
import SpotsRepository from '../core/domain/spots/SpotsRepository';

export enum DashboardTab {
  Playlist = 0,
  Suggestions = 1,
  Chat = 2,
}

export interface DashboardState {
  currentActiveTab: DashboardTab;
  showSelectSessionModal: boolean;
  playing: string;
  searchText: string;
  foundSongs: SongVM[];
  suggestions: SongVM[];
  spotUsers: SpotUserVM[];
  openActionModal: boolean;
  isPlayerModalOpen: boolean;
  isSearchingSongs?: boolean;
  isSearchViewActive?: boolean;
  isChatMounted?: boolean;
  songReply?: ReplyPayload | null;
}
export default class DashboardBloc extends Cubit<DashboardState> {
  private songsRepository: SongsRepository;
  private connectivityRepository: ConnectivityRepository;
  private userRepository: UserRepository;
  private spotsRepository: SpotsRepository;
  private connectivitySubscription?: Subscription;
  private spotUsersSubscription?: Subscription;
  private blockedUsersSubscription?: Subscription;
  private nextSongsIdsSubscription?: Subscription;
  private currentSongSubscription?: Subscription;
  private selectedSpotId?: string;
  private spotCreatorId?: string;
  private nextSongsIds: { [songId: string]: boolean } = {};
  private currentSong?: PublishedSong;
  private blockedUsers: { [userId: string]: boolean } = {};
  private isPlayerReady = false;

  constructor(
    songsRepository: SongsRepository,
    connectivityRepository: ConnectivityRepository,
    userRepository: UserRepository,
    spotsRepository: SpotsRepository,
  ) {
    super({
      currentActiveTab: DashboardTab.Playlist,
      showSelectSessionModal: false,
      playing: '',
      searchText: '',
      foundSongs: [],
      suggestions: [],
      openActionModal: false,
      isPlayerModalOpen: false,
      isSearchViewActive: false,
      spotUsers: [],
    });
    this.connectivityRepository = connectivityRepository;
    this.songsRepository = songsRepository;
    this.userRepository = userRepository;
    this.spotsRepository = spotsRepository;
  }

  private onConnectivityStatusChanged = (isConnectedToDatabase: boolean) => {
    if (!isConnectedToDatabase) return;
    this.userRepository.updateUserSelectedSpot({
      spotId: this.selectedSpotId!,
      shouldRemoveOnDisconnect: true,
    });
  };

  private filterAdminsAndSetIsBlockedStatus = (
    spotUsers: User[] | SpotUserVM[],
  ): SpotUserVM[] => {
    const spotUsersVM: SpotUserVM[] = [];
    spotUsers.forEach(user => {
      if (user.uid !== this.spotCreatorId)
        spotUsersVM.push({
          name: user.name,
          avatar: user.avatar,
          uid: user.uid,
          isBlocked: this.blockedUsers[user.uid!],
        });
    });
    return spotUsersVM;
  };

  private parseToSongVM = (songs: Song[]): SongVM[] => {
    return songs.map(song => {
      return {
        ...song,
        durationFormatted: song.duration
          ? MusicDurationFormatter.format(song.duration)
          : '',
        isAlreadyInPlaylist:
          this.nextSongsIds[song.id] || this.currentSong?.song.id === song.id,
      };
    });
  };

  private updateFoundSongsStatus = (): SongVM[] => {
    return this.state.foundSongs.map(song => ({
      ...song,
      isAlreadyInPlaylist:
        this.nextSongsIds[song.id] || this.currentSong?.song.id === song.id,
    }));
  };

  private updateSuggestionsStatus = (): SongVM[] => {
    return this.state.suggestions.map(song => ({
      ...song,
      isAlreadyInPlaylist:
        this.nextSongsIds[song.id] || this.currentSong?.song.id === song.id,
    }));
  };

  private onSpotUsersChanged = (spotUsers: User[]) => {
    this.emit({
      ...this.state,
      spotUsers: this.filterAdminsAndSetIsBlockedStatus(spotUsers),
    });
  };

  private onNextSongsIdsChanged = (nextSongsIds: {
    [songId: string]: boolean;
  }) => {
    if (nextSongsIds) this.nextSongsIds = nextSongsIds;
    else this.nextSongsIds = {};
    const foundSongs = this.updateFoundSongsStatus();
    const suggestions = this.updateSuggestionsStatus();
    this.emit({ ...this.state, foundSongs, suggestions });
  };

  private onCurrentSongChanged = (currentSong: PublishedSong) => {
    this.currentSong = currentSong;
    const foundSongs = this.updateFoundSongsStatus();
    const suggestions = this.updateSuggestionsStatus();
    this.emit({ ...this.state, foundSongs, suggestions });
    if (this.state.suggestions.length === 0 && this.isPlayerReady)
      this.loadSuggestions();
  };

  private onBlockedUsersChanged = (blockedUsers: {
    [userId: string]: boolean;
  }) => {
    if (blockedUsers) this.blockedUsers = blockedUsers;
    else this.blockedUsers = {};
    this.emit({
      ...this.state,
      spotUsers: this.filterAdminsAndSetIsBlockedStatus(this.state.spotUsers),
    });
  };

  start = (selectedSpotId: string, spotCreatorId: string) => {
    this.selectedSpotId = selectedSpotId;
    this.spotCreatorId = spotCreatorId;
    this.connectivitySubscription =
      this.connectivityRepository.subscribeToConnectivityUpdates(
        this.onConnectivityStatusChanged,
      );
    this.spotUsersSubscription =
      this.userRepository.subscribeToUsersConnectedToSpot(
        this.selectedSpotId,
        this.onSpotUsersChanged,
      );
    this.blockedUsersSubscription =
      this.spotsRepository.subscribeToBlockedUsersUpdates(
        this.selectedSpotId,
        this.onBlockedUsersChanged,
      );
    this.nextSongsIdsSubscription =
      this.spotsRepository.subscribeToNextSongsIdsUpdates(
        this.selectedSpotId,
        this.onNextSongsIdsChanged,
      );
    this.currentSongSubscription =
      this.spotsRepository.subscribeToCurrentSongUpdates(
        this.selectedSpotId,
        this.onCurrentSongChanged,
      );
  };

  loadSuggestionForSong = async (song: Song) => {
    if (!this.isPlayerReady) return;
    const suggestions = await this.songsRepository.getSuggestedSongs(
      song.artistName,
      song.id,
    );
    this.emit({
      ...this.state,
      suggestions: this.parseToSongVM(suggestions),
    });
  };

  loadSuggestions = async () => {
    this.isPlayerReady = true;
    if (!this.currentSong) return;
    const suggestions = await this.songsRepository.getSuggestedSongs(
      this.currentSong.song?.artistName,
      this.currentSong.song.id,
    );
    this.emit({
      ...this.state,
      suggestions: this.parseToSongVM(suggestions),
    });
  };

  unmount = () => {
    this.userRepository.removeUserSelectedSpot();
    this.connectivitySubscription?.unsubscribe();
    this.spotUsersSubscription?.unsubscribe();
    this.blockedUsersSubscription?.unsubscribe();
    this.nextSongsIdsSubscription?.unsubscribe();
    this.currentSongSubscription?.unsubscribe();
  };

  searchSongsByText = async () => {
    if (!this.state.searchText) return;

    this.emit({
      ...this.state,
      isSearchViewActive: true,
      isSearchingSongs: true,
    });
    const foundSongs = await this.songsRepository.searchSongs(
      this.state.searchText,
    );
    this.emit({
      ...this.state,
      foundSongs: this.parseToSongVM(foundSongs),
      isSearchingSongs: false,
    });
  };

  handleSearchTextChange = (searchText: string) => {
    this.emit({ ...this.state, searchText });
  };

  closeSearchView = async () => {
    this.emit({
      ...this.state,
      isSearchViewActive: false,
      isSearchingSongs: false,
      searchText: '',
    });
  };

  openPlayerModal = () => {
    this.emit({ ...this.state, isPlayerModalOpen: true });
  };

  changeCurrentTab(tabIndex: DashboardTab) {
    const isChatMounted =
      this.state.isChatMounted || tabIndex === DashboardTab.Chat;
    this.emit({ ...this.state, currentActiveTab: tabIndex, isChatMounted });
  }

  toggleBlockUser = (user: SpotUserVM) => {
    if (user.isBlocked) this.spotsRepository.unblockUser(user.uid!);
    else this.spotsRepository.blockUser(user.uid!);
  };

  replyToSong = (reply: ReplyPayload) => {
    this.emit({
      ...this.state,
      currentActiveTab: DashboardTab.Chat,
      songReply: reply,
    });
  };

  cleanSongReply = () => {
    this.emit({ ...this.state, songReply: null });
  };
}
