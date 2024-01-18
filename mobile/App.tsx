/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import {navigationRef} from './src/RootNavigation';
import SplashScreen from './src/screens/SplashScreen';
import AccessScreen from './src/screens/AccessScreen';
import SpotsList from './src/screens/SpotsList';
import DashboardScreen from './src/screens/DashboardScreen';
import FirebaseApp from '@react-native-firebase/app';

if (FirebaseApp.apps.length < 2) {
  FirebaseApp.initializeApp(
    {
      apiKey: 'AIzaSyCiR5sFwHkHnc69lTLR5jz2FlwcOVfXCwg',
      authDomain: 'zona-burguer.firebaseapp.com',
      projectId: 'zona-burguer',
      storageBucket: 'zona-burguer.appspot.com',
      messagingSenderId: '494655270416',
      appId: '1:494655270416:web:c427014d81713148fb6495',
      measurementId: 'G-KW9789C2RD',
      databaseURL: 'https://zona-burguer.firebaseio.com',
    },
    'zona-burguer',
  );
}

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Access"
          component={AccessScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SpotsList"
          component={SpotsList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
