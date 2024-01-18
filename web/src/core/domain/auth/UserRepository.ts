import { Subscription } from '../DataSubscriptions';
import AuthService from './AuthService';
import { User } from './User';
import {
  LocalUserService,
  RemoteUserService,
  SpotUsersCallback,
} from './UserService';
import AuthNetworkRequestError from './AuthNetworkRequestError';

export default class UserRepository {
  localUserService: LocalUserService;
  remoteUserService: RemoteUserService;
  authService: AuthService;
  user: User;
  constructor(
    user: User,
    localUserService: LocalUserService,
    remoteUserService: RemoteUserService,
    authService: AuthService,
  ) {
    this.localUserService = localUserService;
    this.remoteUserService = remoteUserService;
    this.authService = authService;
    this.user = user;
  }

  getCurrentUser = async () => {
    this.user?.update(await this.localUserService.getCurrentUser());
    return this.user;
  };

  setCurrentUser = (user: User): void => {
    this.user?.update(user);
    return this.localUserService.setCurrentUser(user);
  };

  updateUserSelectedSpot({
    spotId,
  }: {
    spotId: string | null;
    shouldRemoveOnDisconnect?: boolean;
  }): Promise<void> {
    return this.remoteUserService.updateUserSelectedSpot(
      this.user.uid!,
      spotId,
    );
  }

  subscribeToUsersConnectedToSpot(
    spotId: string,
    callback: SpotUsersCallback,
  ): Subscription {
    return this.remoteUserService.subscribeToUsersConnectedToSpot(
      spotId,
      callback,
    );
  }

  removeUserSelectedSpot(): Promise<void> {
    return this.remoteUserService.removeUserSelectedSpot(this.user.uid!);
  }

  authenticateWithGoogle = async () => {
    // prettier-ignore
    try {
      const user = await this.authService.authenticateWithGoogle();
      await this.remoteUserService.updateUserInfo(user);
      return user;
    } catch (error: any) {
      if (error.code === 'auth/network-request-failed')
        throw new AuthNetworkRequestError();
      throw error;
    }
  };
}
