import { User } from '../../core/domain/auth/User';
import { LocalUserService } from '../../core/domain/auth/UserService';

export default class LocalStorageUserService implements LocalUserService {
  user?: User;
  getCurrentUser() {
    try {
      const json = localStorage.getItem('currentUser');
      this.user = JSON.parse(json!) as User;
      return Promise.resolve(this.user);
    } catch (error) {
      throw new Error('Parsing Current User Error');
    }
  }

  setCurrentUser(user: User): void {
    this.user = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
