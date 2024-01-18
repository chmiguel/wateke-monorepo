import database from '@react-native-firebase/database';
import {Subscription} from '../../../../web/src/core/domain/DataSubscriptions';
import {PublishedSong} from '../../../../web/src/core/domain/music/Music';
import {
  Spot,
  UserConfigValue,
} from '../../../../web/src/core/domain/spots/Spot';
import {
  BlockedUsersCallback,
  NextSongsIdsCallback,
  RemoteSpotsService,
  SpotConfigCallback,
} from '../../../../web/src/core/domain/spots/SpotsService';

export default class FirebaseSpotsService implements RemoteSpotsService {
  private currentSpotId?: string;
  private spotRef?: any;

  async fetchSpot(spotId: string): Promise<Spot> {
    const path = `spots/${spotId}`;
    const spotRef = database().ref(path);
    const result = await spotRef.once('value');
    const spot = result.val();
    if (spot) return {...spot, id: spotId};
    throw new Error('spots/not-found');
  }

  blockUser(spotId: string, userId: string): Promise<void> {
    this.updateSpotRef(spotId);
    return this.spotRef.child('blockedUsers').update({
      [userId]: true,
    });
  }

  unblockUser(spotId: string, userId: string): Promise<void> {
    this.updateSpotRef(spotId);
    return this.spotRef.child('blockedUsers').child(userId).remove();
  }

  async getPopularSpots(): Promise<Spot[]> {
    const spotsRef = database().ref('spots');

    const snap = await spotsRef
      .orderByChild('joinings')
      .limitToLast(10)
      .once('value');
    const results = snap.val();

    let arr: Spot[] = [];
    if (results) {
      Object.keys(results).forEach(item => {
        const obj = results[item];
        obj.id = item;
        arr.push(obj);
      });
      arr = arr.sort((a, b) => {
        let aNum = 0;
        let bNum = 0;
        if (a.joinings) aNum = a.joinings;
        if (b.joinings) bNum = b.joinings;
        return bNum - aNum;
      });
    }
    return arr;
  }

  async getUserSpots(userId: string): Promise<Spot[]> {
    const spotsRef = database().ref('spots');
    const snap = await spotsRef
      .orderByChild('creator')
      .equalTo(userId)
      .once('value');
    const results = snap.val();
    const arr: Spot[] = [];
    if (results) {
      Object.keys(results).forEach(item => {
        const obj = results[item];
        obj.id = item;
        arr.push(obj);
      });
    }
    return arr;
  }

  setOnlineStatus(spotId: string, isOnline: boolean): Promise<void> {
    const isOnlineRef = database().ref(`/spots/${spotId}/isOnline`);
    isOnlineRef.set(isOnline);
    isOnlineRef.onDisconnect().remove();
    return Promise.resolve();
  }

  async searchSpots(text: string): Promise<Spot[]> {
    const spotsRef = database().ref('spots');

    const snap = await spotsRef.orderByChild('joinings').once('value');
    const results = snap.val();
    const arr: Spot[] = [];
    if (results) {
      Object.keys(results).forEach(item => {
        const spotName = results[item].name;
        const spotHasName = !!spotName;
        if (
          spotHasName &&
          spotName.toLowerCase().indexOf(text.toLowerCase()) !== -1
        ) {
          const obj = results[item];
          obj.id = item;
          arr.push(obj);
        }
      });
    }
    return arr;
  }

  async fetchSpotIsPlayingProp(spotId: string): Promise<boolean> {
    this.updateSpotRef(spotId);
    const songPlayingId = await this.spotRef.child('playing').once('value');
    const isPlaying = songPlayingId ? !!songPlayingId.val() : false;
    return isPlaying;
  }

  private updateSpotRef(spotId: string) {
    if (!this.spotRef || this.currentSpotId !== spotId)
      this.spotRef = database().ref(`spots/${spotId}`);
    this.currentSpotId = spotId;
  }

  subscribeToCurrentSongUpdates(
    spotId: string,
    callback: (currentSong: PublishedSong) => void,
  ): Subscription {
    this.updateSpotRef(spotId);
    this.spotRef.child('currentSong').on('value', (snapshot: any) => {
      const currentSong = snapshot.val();
      callback(currentSong);
    });
    return {
      unsubscribe: () => this.spotRef.child('currentSong').off('value'),
    };
  }

  subscribeToSpotConfigUpdates(
    spotId: string,
    callback: SpotConfigCallback,
  ): Subscription {
    const configRef = database().ref(`spots/${spotId}/config`);
    const listener = configRef.on('value', snapshot => {
      callback(snapshot.val());
    });
    return {
      unsubscribe: () => configRef.off('value', listener),
    };
  }

  updateSetting(
    spotId: string,
    settingId: string,
    value: UserConfigValue,
  ): Promise<void> {
    const configRef = database().ref(`spots/${spotId}/config`);
    return configRef.child(settingId).set(value);
  }

  subscribeToBlockedUsersUpdates(
    spotId: string,
    callback: BlockedUsersCallback,
  ): Subscription {
    this.updateSpotRef(spotId);
    this.spotRef.child('blockedUsers').on('value', (snapshot: any) => {
      callback(snapshot.val());
    });
    return {
      unsubscribe: () => this.spotRef.child('blockedUsers').off('value'),
    };
  }

  subscribeToNextSongsIdsUpdates(
    spotId: string,
    callback: NextSongsIdsCallback,
  ): Subscription {
    this.updateSpotRef(spotId);
    this.spotRef.child('nextSongsIds').on('value', (snapshot: any) => {
      const nextSongsIds = snapshot.val();
      callback(nextSongsIds);
    });
    return {
      unsubscribe: () => this.spotRef.child('nextSongsIds').off('value'),
    };
  }

  removeSongFromNextSongsIds(spotId: string, songId: string): Promise<void> {
    return database()
      .ref(`spots/${spotId}`)
      .child('nextSongsIds')
      .child(songId)
      .remove();
  }

  addSongToNextSongsIds(spotId: string, songId: string): Promise<void> {
    return database()
      .ref(`spots/${spotId}/nextSongsIds`)
      .update({
        [songId]: true,
      });
  }

  clearNextSongIds(spotId: string): Promise<void> {
    return database().ref(`spots/${spotId}/nextSongsIds`).remove();
  }

  setCurrentSong(spotId: string, song: PublishedSong | null): Promise<void> {
    this.updateSpotRef(spotId);
    return this.spotRef.update({
      currentSong: song,
    });
  }
}
