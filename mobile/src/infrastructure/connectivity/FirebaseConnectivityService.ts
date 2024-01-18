import ConnectivityService, {
  ConnectivityCallback,
} from '../../../../web/src/core/domain/connectivity/ConnectivityService';
import {Subscription} from '../../../../web/src/core/domain/DataSubscriptions';
import database from '@react-native-firebase/database';

export default class FirebaseConnectivityService
  implements ConnectivityService
{
  private connectedRef: any;

  private updateConnectedRef() {
    if (!this.connectedRef)
      this.connectedRef = database().ref('.info/connected');
  }

  subscribeToConnectivityUpdates(callback: ConnectivityCallback): Subscription {
    this.updateConnectedRef();
    this.connectedRef.on('value', (snapshot: any) => callback(snapshot.val()));

    return {
      unsubscribe: () => this.connectedRef.off('value'),
    };
  }
}
