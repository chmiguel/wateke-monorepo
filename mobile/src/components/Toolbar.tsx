import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import * as config from '../constants/config';
import {PublishedSong} from '../../../web/src/core/domain/music/Music';

const window = Dimensions.get('window');

type AppToolbarProps = {
  containerStyle?: ViewStyle;
  centerElementStyle?: ViewStyle;
  showSearch?: boolean;
  currentSong?: PublishedSong;
  onPressUnmountVideo?: () => void;
  onStartSearch?: () => void;
  onChangeSearch?: (searchText: string) => void;
  leftElement?: string;
  rightElement?: string;
  title: string;
  onLeftElementPress?: () => void;
  onRightElementPress?: () => void;
};

const AppToolbar: React.FC<AppToolbarProps> = props => {
  const [isCurrentVideoPublisherVisible] = useState(false);

  return (
    <View style={[styles.container, props.containerStyle]}>
      {isCurrentVideoPublisherVisible ? (
        <Animatable.View animation="bounceIn">
          <TouchableOpacity
            onPress={props.onPressUnmountVideo}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              margin: 10,
              marginTop: 13,
            }}>
            <Icon size={26} color={'#808080'} name="chevron-left" />
            {props.currentSong?.publisher?.avatar ? (
              <Image
                style={styles.avatar}
                source={{uri: props.currentSong.publisher.avatar!}}
              />
            ) : null}
          </TouchableOpacity>
        </Animatable.View>
      ) : (
        <View style={styles.left}>
          {props.leftElement ? (
            <Animatable.View animation="flipInX">
              <TouchableOpacity
                style={styles.left}
                onPress={props.onLeftElementPress}>
                {props.leftElement === 'menu' ? (
                  <Image
                    source={require('../assets/images/menu.png')}
                    style={styles.iconImage}
                  />
                ) : (
                  <Icon
                    size={26}
                    color={config.accentColor}
                    name={props.leftElement}
                  />
                )}
              </TouchableOpacity>
            </Animatable.View>
          ) : null}
        </View>
      )}
      <View style={[styles.center, props.centerElementStyle]}>
        {props.title && !props.showSearch ? (
          <Text numberOfLines={1} style={styles.appTitle}>
            {props.title}
          </Text>
        ) : (
          <Animatable.View animation="flipInX">
            <TextInput
              maxLength={30}
              placeholderTextColor="#eaeaea"
              style={[
                styles.searchInput,
                props.rightElement ? undefined : {marginRight: 40},
              ]}
              returnKeyType="search"
              onEndEditing={props.onStartSearch}
              autoFocus
              onChangeText={props.onChangeSearch}
              placeholder="Buscar"
            />
          </Animatable.View>
        )}
      </View>
      {props.rightElement ? (
        <View style={styles.right}>
          <TouchableOpacity
            style={styles.right}
            onPress={props.onRightElementPress}>
            <Icon
              size={26}
              style={{margin: 10}}
              onPress={props.onRightElementPress}
              color={config.accentColor}
              name={props.rightElement}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 56,
    width: window.width,
    flexDirection: 'row',
    elevation: 4,
    backgroundColor: config.primaryColor,
  },
  left: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 80,
    justifyContent: 'center',
  },
  right: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  appTitle: {
    fontFamily: config.fontBold,
    color: config.primaryTextColor,
    fontSize: 18,
  },
  logo: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  iconImage: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  searchInput: {
    color: config.primaryDarkTextColor,
    backgroundColor: config.primaryColor,
    height: 30,
    borderRadius: 30,
    paddingLeft: 15,
    fontFamily: config.fontLight,
    paddingBottom: 0,
    paddingTop: 3,
  },
});

export default AppToolbar;
