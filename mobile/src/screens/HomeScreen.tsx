import {SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import SearchInput from '../componets/SearchInput';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SearchInput />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D141A',
    padding: 20,
  },
});

export default HomeScreen;
