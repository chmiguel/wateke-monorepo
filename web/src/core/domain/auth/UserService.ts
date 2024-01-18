import { Subscription } from '../DataSubscriptions';
import { User } from './User';

export type SpotUsersCallback = (users: User[]) => void;

export interface LocalUserService {
  user?: User | null;

  getCurrentUser(): Promise<User>;

  setCurrentUser(user: User): void;
}

export interface RemoteUserService {
  updateUserSelectedSpot(userId: string, spotId: string | null): Promise<void>;

  removeUserSelectedSpot(userId: string): Promise<void>;

  updateUserInfo(user: User): Promise<void>;

  subscribeToUsersConnectedToSpot(
    spotId: string,
    callback: SpotUsersCallback,
  ): Subscription;
}
