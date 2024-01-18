'use strict';

import React, {useEffect} from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Text,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
// import firebase from 'react-native-firebase';
// import {Actions} from 'react-native-router-flux';
import Carousel from 'react-native-snap-carousel';
// import ActionButton from 'react-native-action-button';
import Toolbar from '../components/Toolbar';
import SpotCard from '../components/SpotCard';
// import DrawerMenu from '../components/DrawerMenu';
import * as config from '../constants/config';
// import ActionModal from '../components/ActionModal';
import strings from '../constants/translations';
import {selectedSpotBloc, useBloc} from '../state';
import BlocsFactory from '../BlocsFactory';
import withBloc from '../withBlocHOC';
import SpotsListBloc from '../presenters/SpotsListBloc';
import {Spot} from '../../../web/src/core/domain/spots/Spot';
import {useNavigation} from '@react-navigation/native';

const window = Dimensions.get('window');

const SpotsList = () => {
  const [state, bloc] = useBloc(SpotsListBloc);
  const navigation = useNavigation();

  useEffect(() => {
    bloc.start();
  }, [bloc]);

  const handleSelectSpot = (spot: Spot) => {
    if (spot.config.provider === 'youtube') {
      bloc.selectSpot(spot);
      navigation.navigate('Dashboard' as never);
    }
  };

  const renderSpotItem = ({item, index}: {item: Spot; index: number}) => {
    return (
      <SpotCard
        index={index}
        onPress={spot => handleSelectSpot(spot)}
        item={item}
      />
    );
  };

  const handleRefresh = () => {};

  return (
    <ImageBackground
      source={require('../assets/images/fondo3x.jpg')}
      style={styles.container}>
      <Toolbar
        onStartSearch={bloc.search}
        onChangeSearch={bloc.handleSearchTextChanged}
        // showSearch={isSearchEnabled}
        containerStyle={styles.customToolbar}
        title="Spots"
        // onLeftElementPress={() => _drawer.open()}
        leftElement="menu"
      />
      {
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={state.isLoadingSpots}
              onRefresh={handleRefresh}
            />
          }
          contentContainerStyle={styles.contentContainer}>
          {state.isSearchingSpots ? (
            <View style={{margin: 30, marginTop: 10}}>
              <ActivityIndicator color="#fff" size="small" />
            </View>
          ) : null}

          <View style={{marginTop: 0}}>
            {state.popularSpots.length ? (
              <View style={styles.titlesContainer}>
                <Text style={styles.descriptionText}>
                  {strings.popularSpotsDesc}
                </Text>
                <Text style={styles.groupTitle}>{strings.popularSpots}</Text>
              </View>
            ) : null}
            <Carousel
              // enableSnap={true}
              data={state.popularSpots}
              renderItem={renderSpotItem}
              sliderWidth={window.width}
              itemWidth={window.width * 0.5}
            />
          </View>

          {state.userSpots.length ? (
            <View style={{marginTop: 30}}>
              <View style={styles.titlesContainer}>
                <Text style={styles.descriptionText}>
                  {strings.mySpotsDesc}
                </Text>
                <Text style={styles.groupTitle}>{strings.mySpots}</Text>
              </View>
              <Carousel
                data={state.userSpots}
                renderItem={renderSpotItem}
                sliderWidth={window.width}
                itemWidth={window.width * 0.5}
              />
            </View>
          ) : null}
        </ScrollView>
      }
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.backScreensColor,
  },
  contentContainer: {
    width: '100%',
    paddingBottom: 90,
  },
  groupTitle: {
    color: config.accentColor,
    fontSize: 20,
    fontFamily: config.fontBold,
    marginBottom: 15,
  },
  titlesContainer: {
    paddingLeft: 10,
  },
  descriptionText: {
    color: '#eaeaea',
    fontSize: 12,
    fontFamily: config.fontLight,
    marginBottom: -5,
  },
  customToolbar: {
    backgroundColor: 'transparent',
  },
});

export default withBloc(SpotsList, () =>
  BlocsFactory.spotsListBloc(selectedSpotBloc),
);
