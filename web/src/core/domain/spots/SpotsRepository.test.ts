import { anything, instance, mock, verify, when } from 'ts-mockito';
import { User } from '../auth/User';
import { PublishedSong } from '../music/Music';
import SettingsService from './SettingsService';
import { Spot } from './Spot';
import SpotsRepository from './SpotsRepository';
import { LocalSpotsService, RemoteSpotsService } from './SpotsService';

describe('SpotsRepository should', () => {
  it('retrieve current spot from local storage', async () => {
    when(localSpotService.getCurrentSpot()).thenResolve(aSpot);

    repository.getCurrentSpot();

    verify(localSpotService.getCurrentSpot()).called();
  });

  it('save the current spot to local storage', async () => {
    repository.setCurrentSpot(aSpot);

    verify(localSpotService.setCurrentSpot(aSpot)).called();
  });

  it('save the current spot to local storage', async () => {
    repository.setCurrentSpot(aSpot);

    verify(localSpotService.setCurrentSpot(aSpot)).called();
  });

  it('pass down the callback when subscribing to spot updates', async () => {
    const callback = jest.fn();

    repository.subscribeToCurrentSongUpdates('aSpotId', callback);

    verify(
      remoteSpotsService.subscribeToCurrentSongUpdates('aSpotId', callback),
    ).called();
  });

  it('pass down the callback when subscribing to the spot blocked users', async () => {
    const callback = jest.fn();

    repository.subscribeToBlockedUsersUpdates('aSpotId', callback);

    verify(
      remoteSpotsService.subscribeToBlockedUsersUpdates('aSpotId', callback),
    ).called();
  });

  it('pass down the callback when subscribing to the spot next songs IDs', async () => {
    const callback = jest.fn();

    repository.subscribeToNextSongsIdsUpdates('aSpotId', callback);

    verify(
      remoteSpotsService.subscribeToNextSongsIdsUpdates('aSpotId', callback),
    ).called();
  });

  it('pass down the callback when subscribing to the spot config update', async () => {
    localSpotService.spot = aSpot;
    const callback = jest.fn();

    repository.subscribeToSpotConfigUpdates(callback);

    verify(
      remoteSpotsService.subscribeToSpotConfigUpdates(anything(), callback),
    ).called();
  });

  it('set current song in remote service', async () => {
    localSpotService.spot = aSpot;

    repository.setCurrentSpotSong(aSong);

    verify(remoteSpotsService.setCurrentSong(anything(), aSong)).called();
  });

  it('block a user', async () => {
    localSpotService.spot = aSpot;

    repository.blockUser(aUser.uid!);

    verify(remoteSpotsService.blockUser(anything(), aUser.uid!)).called();
  });

  it('unblock a user', async () => {
    localSpotService.spot = aSpot;

    repository.unblockUser(aUser.uid!);

    verify(remoteSpotsService.unblockUser(anything(), aUser.uid!)).called();
  });

  it('get available spot settings stored locally', async () => {
    repository.getAvailableSettings();

    verify(settingsService.getAvailableSettings()).called();
  });

  it('update a setting in the remote spot config', async () => {
    repository.updateSpotSetting('maxSongsPerUser', 5);

    verify(
      remoteSpotsService.updateSetting(anything(), 'maxSongsPerUser', 5),
    ).called();
  });

  beforeEach(() => {
    localSpotService = mock<LocalSpotsService>();
    remoteSpotsService = mock<RemoteSpotsService>();
    settingsService = mock<SettingsService>();
    repository = createRepository();
  });

  function createRepository(): SpotsRepository {
    return new SpotsRepository(
      instance(localSpotService),
      instance(remoteSpotsService),
      instance(settingsService),
    );
  }

  let repository: SpotsRepository;
  let localSpotService: LocalSpotsService;
  let remoteSpotsService: RemoteSpotsService;
  let settingsService: SettingsService;

  const aUser: User = new User({
    avatar: 'an avatar',
    name: 'Test user',
    email: 'test@user.com',
    uid: 'userId',
  });

  const aSpot: Spot = {
    name: 'A spot',
    adminConnection: 'abc12345',
    coverPicture: 'a photo link',
    isOnline: false,
    coverPictureRef: '/photoRef',
    coverPictureMin: '',
    creator: 'abcUser12345',
    finishingSong: false,
    config: { maxPostsPerUser: 10, isPhotosCarouselEnabled: false },
    spotConnections: 10,
    logo: 'logo link',
    public: true,
    id: 'randomSpotId',
  };

  const aSong: PublishedSong = {
    id: 'a song',
    spotId: aSpot.id,
    publishDate: 123454566,
    song: {
      albumTitle: 'Muerte',
      artistName: 'Canserbero',
      duration: 318,
      id: 2334243245,
      title: 'Jeremías 17-5',
      pictureSmall: 'a picture link',
      pictureMedium: 'another picture link',
      provider: 'deezer',
      artistPicture: null,
    },
    publisher: aUser,
  };
});
