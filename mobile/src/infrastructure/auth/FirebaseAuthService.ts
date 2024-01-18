import AuthService from '../../../../web/src/core/domain/auth/AuthService';
import {User} from '../../../../web/src/core/domain/auth/User';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
  scopes: [],
  webClientId:
    '407305173791-jaiakbb36758lg84u8ncc8t8e0nl3qsv.apps.googleusercontent.com',
  iosClientId:
    '407305173791-dil0gjvk7qckdqmuqc8i4r3a7isi5tq1.apps.googleusercontent.com',
});

export default class FirebaseAuthService implements AuthService {
  async authenticateWithGoogle(): Promise<User> {
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const result = await auth().signInWithCredential(googleCredential);
    return new User({
      email: result.user.email,
      name: result.user.displayName,
      avatar:
        result?.additionalUserInfo?.profile?.picture || result.user.photoURL,
      uid: result.user.uid,
    });
  }
}
