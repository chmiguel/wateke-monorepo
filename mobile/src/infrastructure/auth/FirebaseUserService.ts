import {User} from '../../../../web/src/core/domain/auth/User';
import {
  RemoteUserService,
  SpotUsersCallback,
} from '../../../../web/src/core/domain/auth/UserService';
import {Subscription} from '../../../../web/src/core/domain/DataSubscriptions';
import database from '@react-native-firebase/database';

export default class FirebaseUserService implements RemoteUserService {
  updateUserSelectedSpot(userId: string, spotId: string): Promise<void> {
    const userSpotRef = database().ref(`usuarios/${userId}/selectedSpot`);
    userSpotRef;
    userSpotRef.onDisconnect().remove();
    return userSpotRef.set(spotId);
  }

  updateUserInfo(user: User): Promise<void> {
    const path = `usuarios/${user.uid}`;
    const userRef = database().ref(path);
    return userRef.update(user);
  }

  removeUserSelectedSpot(userId: string): Promise<void> {
    const userSpotRef = database().ref(`usuarios/${userId}/selectedSpot`);
    userSpotRef;
    return userSpotRef.remove();
  }

  subscribeToUsersConnectedToSpot(
    spotId: string,
    callback: SpotUsersCallback,
  ): Subscription {
    const refUsers = database().ref('usuarios');
    refUsers
      .orderByChild('selectedSpot')
      .equalTo(spotId)
      .on('value', snap => {
        const results = snap.val();
        if (results) {
          const users = Object.keys(results).map(key => new User(results[key]));
          callback(users);
        } else {
          callback([]);
        }
      });
    return {
      unsubscribe: () => refUsers.off('value'),
    };
  }
}
