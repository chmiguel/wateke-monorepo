'use strict';

import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {StyleSheet, Image, ImageBackground} from 'react-native';
import UserBloc from '../../../web/src/core/blocs/UserBloc';
import {useBloc} from '../state';

const Background = require('../assets/images/fondo3x.jpg');

const SplashScreen = () => {
  const navigation = useNavigation();
  const [userState] = useBloc(UserBloc);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      if (userState.name) {
        clearTimeout(timeout.current!);
        navigation.reset({
          index: 0,
          routes: [{name: 'SpotsList' as never}],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'Access' as never}],
        });
      }
    }, 2000);
  }, [navigation, userState]);
  return (
    <ImageBackground
      blurRadius={6}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      source={Background}>
      <Image
        style={styles.logo}
        source={require('../assets/images/logo-med.png')}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  appTitle: {
    color: '#fff',
    fontSize: 50,
    fontFamily: 'Pacifico-Regular',
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
