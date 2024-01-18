import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Dimensions,
  Animated,
  ImageBackground,
  StatusBar,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  TabView,
  TabBar,
  SceneRendererProps,
  Route,
} from 'react-native-tab-view';
import {useBloc} from '../state';
import SelectedSpotBloc from '../../../web/src/core/blocs/SelectedSpotBloc';
import ImageMiddleBackground from '../components/ImageMiddleBackground';
import AppToolbar from '../components/Toolbar';
import * as config from '../constants/config';
import Player from '../components/Player';
import {MenuProvider} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialIcons';
import strings from '../constants/translations';
import PostedTrack from '../components/PostedTrack';
import UserBloc from '../../../web/src/core/blocs/UserBloc';
import {PublishedSong} from '../../../web/src/core/domain/music/Music';
import {Scene} from 'react-native-tab-view/lib/typescript/types';
import withBloc from '../withBlocHOC';
import BlocsFactory from '../BlocsFactory';
import DashboardBloc from '../presenters/DashboardBloc';
import SuggestionsList from '../components/SuggestionsList';
import Carousel from 'react-native-snap-carousel';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import FirebaseApp from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const {width, height} = Dimensions.get('window');
const isLargerScreen = width > 600;
const playerWidth = isLargerScreen ? width * 0.7 : width;
const rightPaneWidth = isLargerScreen ? width * 0.3 : width - 20;
const playerHeight = height - 55;
const initialLayout = {
  height: 0,
  width: isLargerScreen ? width * 0.3 : width - 20,
};
const animationsDuration = 600;

type Product = {
  price: number;
  photoIndex: number;
  positionInPhoto: {left?: string; top?: string};
  id: string;
};

const DashboardScreen = () => {
  const [selectedSpotState, selectedSpotBloc] = useBloc(SelectedSpotBloc);
  const [dashboardState, dashboardBloc] = useBloc(DashboardBloc);
  const [userState] = useBloc(UserBloc);
  const [isDisplayingAds, setIsDisplayingAds] = useState(false);
  const adsTimeout = useRef<ReturnType<typeof setTimeout>>();
  const adsOpacityAnimation = useRef(new Animated.Value(0)).current;
  const spotConfig = selectedSpotState?.config;
  const [productsByMenuMap, setProductsByMenuMap] = useState<{
    [photoIndex: number]: Product[];
  }>({});

  const toggleAdvertisements = useCallback(() => {
    if (adsTimeout.current) clearTimeout(adsTimeout.current);
    setIsDisplayingAds(isDisplayingAdsPrev => {
      if (isDisplayingAdsPrev) {
        Animated.timing(adsOpacityAnimation, {
          toValue: 0,
          duration: animationsDuration,
          useNativeDriver: true,
        }).start();
        adsTimeout.current = setTimeout(toggleAdvertisements, 40000);
      } else if (spotConfig?.isPhotosCarouselEnabled) {
        adsTimeout.current = setTimeout(toggleAdvertisements, 59000);
        Animated.timing(adsOpacityAnimation, {
          toValue: 1,
          duration: animationsDuration,
          useNativeDriver: true,
        }).start();
      }
      return !isDisplayingAdsPrev;
    });
  }, [adsOpacityAnimation, spotConfig?.isPhotosCarouselEnabled]);

  useEffect(() => {
    const zonaBurguerApp = FirebaseApp.app('zona-burguer');

    const zonaBurguerFirestore = firestore(zonaBurguerApp);
    const unsubscribeToProductsUpdates = zonaBurguerFirestore
      .collection('products')
      .onSnapshot(snapshot => {
        const newProductsByMenuMap: {[menuPosition: number]: Product[]} = {};

        snapshot.docs.forEach(doc => {
          const product = doc.data() as Product;
          if (product.photoIndex === undefined) return;
          if (newProductsByMenuMap[product.photoIndex]) {
            newProductsByMenuMap[product.photoIndex].push({
              ...product,
              id: doc.id,
            });
          } else {
            newProductsByMenuMap[product.photoIndex] = [
              {...product, id: doc.id},
            ];
          }
        });
        setProductsByMenuMap(newProductsByMenuMap);
      });

    if (spotConfig?.isPhotosCarouselEnabled) {
      adsTimeout.current = setTimeout(toggleAdvertisements, 10000);
    }
    return () => {
      unsubscribeToProductsUpdates();
      if (adsTimeout.current) {
        clearTimeout(adsTimeout.current);
      }
    };
  }, [spotConfig?.isPhotosCarouselEnabled, toggleAdvertisements]);

  const [tabsState, setTabsState] = useState({
    index: 0,
    routes: [
      {
        key: 'first',
        title: strings.posted.toUpperCase(),
        icon: 'playlist-add',
      },
      {
        key: 'second',
        title: strings.suggestions.toUpperCase(),
        icon: 'search',
      },
    ],
  });

  useEffect(() => {
    const currentSpot = selectedSpotBloc.startSelectedSpot();
    dashboardBloc.start(currentSpot?.id!, currentSpot?.creator!);
    dashboardBloc.loadSuggestions();
  }, [selectedSpotBloc, dashboardBloc]);

  const {currentSong, spot} = selectedSpotState;

  const goToTab = (index: number) => {
    setTabsState(prev => ({...prev, index}));
  };

  const renderHeader = (props: any) => (
    <View style={{width: rightPaneWidth}}>
      <TabBar
        {...props}
        renderLabel={renderLabel}
        labelStyle={{color: config.primaryTextColor}}
        indicatorStyle={styles.tabIndicatorStyle}
        style={styles.tabBar}
      />
    </View>
  );

  const renderLabel = (
    scene: Scene<Route> & {
      focused: boolean;
      color: string;
    },
  ) => {
    return <Text style={styles.labelStyle}>{scene.route.title}</Text>;
  };

  const renderPostedItem = ({
    item,
    index,
  }: {
    item: PublishedSong;
    index: number;
  }) => {
    return (
      <PostedTrack
        spotId={selectedSpotState?.spot?.id}
        // onPressWatchComments={this._handleWatchComments}
        isAdmin={selectedSpotBloc.isCurrentUserAdmin()}
        // isBlocked={
        //   item && item.publisher && this.props.blockedUsers[item.publisher.uid]
        // }
        isNextVideo={selectedSpotBloc.isCurrentUserAdmin() && index === 0}
        onPressPlay={selectedSpotBloc.finishCurrentSongAndChangeToNext}
        onPressReact={selectedSpotBloc.reactToSong}
        // onPressDelete={this._handleDelete}
        // onPressBlockUser={this._handleBlockUser}
        // onPressUnblockUser={this._handleUnblockUser}
        uid={userState.uid!}
        item={item}
      />
    );
  };

  const renderScene = ({
    route,
  }: SceneRendererProps & {
    route: Route;
  }) => {
    if (route.key === 'first') {
      if (
        selectedSpotState.currentPlaylist.length === 0 &&
        !selectedSpotState.isLoadingPlaylist
      ) {
        return (
          <TouchableOpacity
            // onPress={() => this._handleChangeAppState('active')}
            style={styles.noVideosCont}>
            <Icon
              size={26}
              color={config.primaryDarkTextColor}
              name="refresh"
            />
            <Text style={styles.noVideosText}>{strings.noPosts}</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={!!selectedSpotState.isLoadingPlaylist}
                // onRefresh={() => this._handleChangeAppState('active')}
              />
            }
            contentContainerStyle={styles.contentContainer}
            data={selectedSpotState.currentPlaylist}
            keyExtractor={item => item.id}
            renderItem={renderPostedItem}
          />
        );
      }
    } else if (route.key === 'second') {
      return (
        <SuggestionsList
          suggestions={dashboardState.suggestions}
          onPressPost={selectedSpotBloc.addSongToPlaylist}
        />
      );
    } else {
      return <View />;
    }
  };

  return (
    <ImageMiddleBackground noImage>
      <StatusBar hidden />

      <AppToolbar
        containerStyle={styles.customToolbar}
        // onLeftElementPress={() => this._drawer.open()}
        title={spot?.name!}
        rightElement="search"
        currentSong={currentSong}
        leftElement="menu"
      />
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          {!currentSong ? (
            <Text style={styles.noVideoText}>
              No hay ningun track en reproducción, postula uno para que empiece
              el Wateke
            </Text>
          ) : null}
        </View>

        <MenuProvider>
          <TabView
            style={{flex: 1, backgroundColor: config.primaryDarkColor}}
            navigationState={tabsState}
            renderScene={renderScene}
            renderTabBar={renderHeader}
            onIndexChange={goToTab}
            initialLayout={initialLayout}
          />
        </MenuProvider>
      </View>
      {
        <Animated.View
          style={[
            styles.adsContainer,
            {
              opacity: adsOpacityAnimation,
              transform: [
                {
                  translateY: adsOpacityAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, height],
                  }),
                },
              ],
            },
          ]}>
          {isDisplayingAds && (
            <Carousel
              enableMomentum={false}
              autoplay
              lockScrollWhileSnapping
              autoplayDelay={3000}
              autoplayInterval={8000}
              loop
              data={
                selectedSpotState.spot?.photos?.map((url, index) => ({
                  photoUrl: url,
                  photoIndex: index,
                })) || []
              }
              renderItem={({item: {photoUrl, photoIndex}, index}) => (
                <View
                  style={{
                    width: width,
                    height: height,
                  }}>
                  <ImageBackground
                    key={index}
                    source={{uri: photoUrl}}
                    resizeMode="contain"
                    style={{flex: 1}}>
                    {productsByMenuMap[photoIndex]?.map(p => {
                      return (
                        <View
                          key={p.id}
                          style={[styles.priceBubble, p.positionInPhoto]}>
                          <Text style={styles.price}>
                            {(p.price * 1.099).toFixed(1)}$
                          </Text>
                        </View>
                      );
                    })}
                  </ImageBackground>
                </View>
              )}
              sliderWidth={width}
              itemWidth={width}
            />
          )}
          <TouchableOpacity
            style={styles.closeAdsButton}
            onPress={toggleAdvertisements}>
            <MdIcon name="clear" size={32} color="black" />
          </TouchableOpacity>
        </Animated.View>
      }
      {currentSong && currentSong.song ? (
        <Animated.View
          style={[
            styles.playerContainer,
            {
              width: isDisplayingAds ? 300 : playerWidth,
              height: isDisplayingAds ? 170 : playerHeight,
              transform: [
                {
                  translateY: adsOpacityAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}>
          <Player
            song={currentSong.song}
            onSongEnded={selectedSpotBloc.finishCurrentSongAndChangeToNext}
          />
        </Animated.View>
      ) : (
        <View />
      )}
    </ImageMiddleBackground>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 5,
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  container: {
    flex: 1,
    flexDirection: isLargerScreen ? 'row' : 'column',
  },
  centerContainer: isLargerScreen
    ? {
        width: playerWidth,
      }
    : {
        height: 220,
      },
  adsContainer: {
    position: 'absolute',
    left: 0,
    top: -height,
    width: '100%',
    height: height,
    backgroundColor: 'rgb(242,123,11)',
  },
  playerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  tooltipText: {
    fontSize: 12,
    fontFamily: config.fontRegular,
  },
  noVideo: {
    height: 160,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  noVideoText: {
    fontFamily: config.fontRegular,
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  labelStyle: {
    color: config.primaryTextColor,
    fontSize: 12,
    fontFamily: config.fontRegular,
    marginTop: 5,
  },
  customToolbar: {
    backgroundColor: 'transparent',
    height: 50,
  },
  tabIndicatorStyle: {
    backgroundColor: config.accentColor,
  },
  noVideosCont: {
    margin: 30,
    alignItems: 'center',
  },
  noVideosText: {
    color: config.primaryDarkTextColor,
    fontFamily: config.fontRegular,
  },
  tabBar: {
    backgroundColor: 'transparent',
    height: 40,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {height: 2, width: 0},
    zIndex: 1,
  },
  closeAdsButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  priceBubble: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  price: {
    fontFamily: config.fontBold,
    color: 'orange',
    fontSize: 34,
    marginTop: 5,
  },
});

export default withBloc(DashboardScreen, () => BlocsFactory.dashboardBloc());
