import {
  capture,
  instance,
  mock,
  verify,
  when,
  anyString,
  anything,
  anyFunction,
} from 'ts-mockito';
import DashboardBloc, { DashboardTab } from './DashboardBloc';
import SongsRepository from '../core/domain/music/SongsRepository';
import ConnectivityRepository from '../core/domain/connectivity/ConnectivityRepository';
import UserRepository from '../core/domain/auth/UserRepository';
import SpotsRepository from '../core/domain/spots/SpotsRepository';
import { User } from '../core/domain/auth/User';

describe('DashboardBloc should', () => {
  it('not start searching if the search text is empty', async () => {
    when(songsRepository.searchSongs(anyString())).thenResolve([]);
    presenter.handleSearchTextChange('');
    expect(presenter.state.isSearchingSongs).toBeFalsy();

    presenter.searchSongsByText();

    expect(presenter.state.isSearchingSongs).toBeFalsy();
  });

  it('show loader when a search starts', async () => {
    when(songsRepository.searchSongs(anyString())).thenResolve([]);
    presenter.handleSearchTextChange('a text');

    presenter.searchSongsByText();

    expect(presenter.state.isSearchingSongs).toBeTruthy();
  });

  it('set the search text and call the search songs use case', async () => {
    when(songsRepository.searchSongs('a search')).thenResolve([]);
    presenter.handleSearchTextChange('a search');

    presenter.searchSongsByText();

    verify(songsRepository.searchSongs('a search')).called();
  });

  it('hide loader when a search ends', async () => {
    when(songsRepository.searchSongs(anyString())).thenResolve([]);
    presenter.handleSearchTextChange('a text');

    await presenter.searchSongsByText();

    expect(presenter.state.isSearchingSongs).toBeFalsy();
  });

  it('close the search view after it was opened', async () => {
    when(songsRepository.searchSongs(anyString())).thenResolve([]);
    presenter.handleSearchTextChange('a text');

    await presenter.searchSongsByText();
    expect(presenter.state.isSearchViewActive).toBeTruthy();

    presenter.closeSearchView();

    expect(presenter.state.isSearchViewActive).toBeFalsy();
  });

  it('open the player modal after being closed', async () => {
    expect(presenter.state.isPlayerModalOpen).toBeFalsy();

    presenter.openPlayerModal();

    expect(presenter.state.isPlayerModalOpen).toBeTruthy();
  });

  it('change the current tab when a new tab is pressed', async () => {
    expect(presenter.state.currentActiveTab).toBe(DashboardTab.Playlist);

    presenter.changeCurrentTab(DashboardTab.Suggestions);

    expect(presenter.state.currentActiveTab).toBe(DashboardTab.Suggestions);
  });

  it('block a user if user was not previously blocked and toggleBlockUser is called', async () => {
    presenter.toggleBlockUser({
      name: 'Test User',
      avatar: '',
      uid: 'abc123',
      isBlocked: false,
    });

    verify(spotsRepository.blockUser('abc123')).called();
  });

  it('unblock a user if user was previously blocked and toggleBlockUser is called', async () => {
    presenter.toggleBlockUser({
      name: 'Test User',
      avatar: '',
      uid: 'abc123',
      isBlocked: true,
    });

    verify(spotsRepository.unblockUser('abc123')).called();
  });

  it('report user selected spot when connected to database', async () => {
    presenter.start('spot1', 'user1');

    const [onConnectivityStatusChangedCallback] = capture(
      connectivityRepository.subscribeToConnectivityUpdates,
    ).last();
    onConnectivityStatusChangedCallback(true);

    const [params] = capture(userRepository.updateUserSelectedSpot).last();
    expect(params.spotId).toBe('spot1');
  });

  it('not report user selected spot when disconnected from database', async () => {
    presenter.start('spot1', 'user1');

    const [onConnectivityStatusChangedCallback] = capture(
      connectivityRepository.subscribeToConnectivityUpdates,
    ).last();
    onConnectivityStatusChangedCallback(false);

    verify(userRepository.updateUserSelectedSpot(anything())).never();
  });

  it('render the spot users', async () => {
    presenter.start('spot1', 'user1');

    const [spotId, onSpotUsersChangedCallback] = capture(
      userRepository.subscribeToUsersConnectedToSpot,
    ).last();
    expect(presenter.state.spotUsers.length).toBe(0);
    onSpotUsersChangedCallback(someSpotUsers);

    expect(spotId).toBe('spot1');
    expect(presenter.state.spotUsers.length).toBe(2);
    expect(presenter.state.spotUsers[0].name).toBe('Test User 1');
  });

  it('render the spot users with a isBlocked flag', async () => {
    presenter.start('spot1', 'user1');

    const [_, onSpotUsersChangedCallback] = capture(
      userRepository.subscribeToUsersConnectedToSpot,
    ).last();
    onSpotUsersChangedCallback(someSpotUsers);
    // not blocked initially
    expect(presenter.state.spotUsers[0].isBlocked).toBeFalsy();

    const [spotId, onBlockedUsersChangedCallback] = capture(
      spotsRepository.subscribeToBlockedUsersUpdates,
    ).last();
    onBlockedUsersChangedCallback(someBlockedUsers);

    expect(spotId).toBe('spot1');
    expect(presenter.state.spotUsers[0].isBlocked).toBeTruthy();
  });

  it('report the user as disconnected from the spot', async () => {
    when(userRepository.removeUserSelectedSpot()).thenResolve();

    presenter.unmount();

    verify(userRepository.removeUserSelectedSpot()).called();
  });

  it('remove subscriptions when component unmounts', async () => {
    const connectivitySubscription = { unsubscribe: jest.fn() };
    const spotUsersSubscription = { unsubscribe: jest.fn() };
    const blockedUsersSubscription = { unsubscribe: jest.fn() };
    when(
      connectivityRepository.subscribeToConnectivityUpdates(anyFunction()),
    ).thenReturn(connectivitySubscription);
    when(
      userRepository.subscribeToUsersConnectedToSpot('spot1', anyFunction()),
    ).thenReturn(spotUsersSubscription);
    when(
      spotsRepository.subscribeToBlockedUsersUpdates('spot1', anyFunction()),
    ).thenReturn(blockedUsersSubscription);

    presenter.start('spot1', 'user1');

    presenter.unmount();

    expect(connectivitySubscription.unsubscribe).toHaveBeenCalledTimes(1);
    expect(spotUsersSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    expect(blockedUsersSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  beforeEach(() => {
    songsRepository = mock<SongsRepository>();
    connectivityRepository = mock<ConnectivityRepository>();
    userRepository = mock<UserRepository>();
    spotsRepository = mock<SpotsRepository>();
    presenter = createPresenter();
  });

  function createPresenter(): DashboardBloc {
    return new DashboardBloc(
      instance(songsRepository),
      instance(connectivityRepository),
      instance(userRepository),
      instance(spotsRepository),
    );
  }

  let presenter: DashboardBloc;
  let songsRepository: SongsRepository;
  let connectivityRepository: ConnectivityRepository;
  let userRepository: UserRepository;
  let spotsRepository: SpotsRepository;

  const someSpotUsers: User[] = [
    new User({ name: 'Test User 1', avatar: 'avatar 1', uid: 'testUser1' }),
    new User({ name: 'Test User 2', avatar: 'avatar 2', uid: 'testUser2' }),
  ];
  const someBlockedUsers: { [userId: string]: boolean } = { testUser1: true };
});
