import { realTimeDatabase } from '../../lib/firebase';
import ConnectivityService, {
  ConnectivityCallback,
} from '../../core/domain/connectivity/ConnectivityService';
import { Subscription } from '../../core/domain/DataSubscriptions';

export default class FirebaseConnectivityService
  implements ConnectivityService
{
  private connectedRef: any;

  private updateConnectedRef() {
    if (!this.connectedRef)
      this.connectedRef = realTimeDatabase.ref('.info/connected');
  }

  subscribeToConnectivityUpdates(callback: ConnectivityCallback): Subscription {
    this.updateConnectedRef();
    this.connectedRef.on('value', (snapshot: any) => callback(snapshot.val()));

    return {
      unsubscribe: () => this.connectedRef.off('value'),
    };
  }
}
