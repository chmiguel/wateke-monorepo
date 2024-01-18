import {User} from '../../../../web/src/core/domain/auth/User';
import {LocalUserService} from '../../../../web/src/core/domain/auth/UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LocalStorageUserService implements LocalUserService {
  user?: User;
  getCurrentUser = async () => {
    try {
      const json = await AsyncStorage.getItem('currentUser');
      this.user = JSON.parse(json!) as User;
      return this.user;
    } catch (error) {
      throw new Error('Parsing Current User Error');
    }
  };

  setCurrentUser(user: User): void {
    this.user = user;
    AsyncStorage.setItem('currentUser', JSON.stringify(user));
  }
}
