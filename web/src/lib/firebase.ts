import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyCIOd05J33mgOVOBI_1CuN-Mh0DlAFixXc',
  authDomain: 'wateke-ee6bf.firebaseapp.com',
  databaseURL: 'https://wateke-ee6bf.firebaseio.com',
  projectId: 'wateke-ee6bf',
  storageBucket: 'wateke-ee6bf.appspot.com',
  messagingSenderId: '407305173791',
  appId: '1:407305173791:web:b170841c20d1c2e2694e2a',
  measurementId: 'G-58GCBFLM8S',
};

firebase.initializeApp(config);

const realTimeDatabase = firebase.database();

export { realTimeDatabase };
