'use strict';

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Image,
  ActivityIndicator,
  View,
} from 'react-native';

import {accentColor} from '../constants/config';
import Button from '../components/Button';
import strings from '../constants/translations';
import {useBloc} from '../state';
import UserBloc from '../../../web/src/core/blocs/UserBloc';
import {useNavigation} from '@react-navigation/native';

const AccessScreen = () => {
  const [userState, userBloc] = useBloc(UserBloc);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userState?.email) {
      navigation.navigate('SpotsList');
    }
  }, [userState, navigation]);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await userBloc.authenticateWithGoogle();
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ImageBackground
      blurRadius={6}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      source={require('../assets/images/fondo3x.jpg')}>
      <Image
        style={styles.logo}
        source={require('../assets/images/logo-med.png')}
      />
      {isLoading ? (
        <View style={{margin: 30}}>
          <ActivityIndicator color={accentColor} size={'large'} />
        </View>
      ) : (
        <View style={{}}>
          <Button
            onPress={signInWithGoogle}
            icon="google"
            iconColor={'red'}
            textStyle={{width: 140}}
            text={`${strings.signIn} Google`}
          />
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  appTitle: {
    color: '#fff',
    fontSize: 50,
    fontFamily: 'Pacifico-Regular',
    marginBottom: 20,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

export default AccessScreen;
