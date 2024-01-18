import AuthService from '../../core/domain/auth/AuthService';
import firebase from 'firebase/app';
import 'firebase/auth';
import { User } from '../../core/domain/auth/User';

export default class FirebaseAuthService implements AuthService {
  googleProvider: firebase.auth.GoogleAuthProvider;
  constructor() {
    this.googleProvider = new firebase.auth.GoogleAuthProvider();
  }

  async authenticateWithGoogle(): Promise<User> {
    const result: any = await firebase
      .auth()
      .signInWithPopup(this.googleProvider);
    return new User({
      email: result.user.email,
      name: result.user.displayName,
      avatar:
        result?.additionalUserInfo?.profile?.picture || result.user.photoURL,
      uid: result.user.uid,
    });
  }
}
