import { realTimeDatabase } from '../../lib/firebase';
import { User } from '../../core/domain/auth/User';
import {
  RemoteUserService,
  SpotUsersCallback,
} from '../../core/domain/auth/UserService';
import { Subscription } from '../../core/domain/DataSubscriptions';

export default class FirebaseUserService implements RemoteUserService {
  updateUserSelectedSpot(userId: string, spotId: string): Promise<void> {
    const userSpotRef = realTimeDatabase.ref(`usuarios/${userId}/selectedSpot`);
    userSpotRef;
    userSpotRef.onDisconnect().remove();
    return userSpotRef.set(spotId);
  }

  updateUserInfo(user: User): Promise<void> {
    const path = `usuarios/${user.uid}`;
    const userRef = realTimeDatabase.ref(path);
    return userRef.update(user);
  }

  removeUserSelectedSpot(userId: string): Promise<void> {
    const userSpotRef = realTimeDatabase.ref(`usuarios/${userId}/selectedSpot`);
    userSpotRef;
    return userSpotRef.remove();
  }

  subscribeToUsersConnectedToSpot(
    spotId: string,
    callback: SpotUsersCallback,
  ): Subscription {
    const refUsers = realTimeDatabase.ref('usuarios');
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
