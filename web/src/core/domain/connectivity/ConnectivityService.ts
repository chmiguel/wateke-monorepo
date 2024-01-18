import { Subscription } from '../DataSubscriptions';

export type ConnectivityCallback = (isConnectedToDatabase: boolean) => void;

export default interface ConnectivityService {
  subscribeToConnectivityUpdates(callback: ConnectivityCallback): Subscription;
}
