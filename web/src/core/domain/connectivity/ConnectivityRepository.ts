import { Subscription } from '../DataSubscriptions';
import ConnectivityService, {
  ConnectivityCallback,
} from './ConnectivityService';

export default class ConnectivityRepository {
  private readonly connectivityService: ConnectivityService;

  constructor(connectivityService: ConnectivityService) {
    this.connectivityService = connectivityService;
  }

  subscribeToConnectivityUpdates(callback: ConnectivityCallback): Subscription {
    return this.connectivityService.subscribeToConnectivityUpdates(callback);
  }
}
