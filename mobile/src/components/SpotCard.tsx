'use strict';

import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import strings from '../constants/translations';
import * as config from '../constants/config';
import {Spot} from '../../../web/src/core/domain/spots/Spot';

const window = Dimensions.get('window');

type Props = {
  item: Spot;
  index: number;
  onPress: (item: Spot, index: number) => void;
  containerStyle?: ViewStyle;
};

export default class SpotCard extends React.PureComponent<Props> {
  _handleSelectSpot = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.item, this.props.index);
    }
  };
  render() {
    let {
      coverPicture,
      name,
      musicTypeName,
      coverPictureMin,
      adminConnections,
      spotConnections,
    } = this.props.item;
    return (
      <TouchableOpacity
        style={[styles.cardSpot, this.props.containerStyle]}
        onPress={this._handleSelectSpot}>
        <ImageBackground
          style={{flex: 1}}
          source={{uri: coverPictureMin || coverPicture}}>
          <View style={styles.backContainer}>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.dot,
                  {backgroundColor: adminConnections ? '#06fe37' : '#808080'},
                ]}
              />
              <Text style={styles.statusText}>
                {adminConnections ? strings.online : strings.offline}
              </Text>
            </View>
            <View style={styles.spotContainer}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="play-circle-filled" color={'#fff'} size={50} />
              </View>
              <Text numberOfLines={1} style={styles.spotName}>
                {name}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.spotCategory}>
          <Icon
            style={{marginBottom: 2}}
            name="music-note"
            color={config.primaryTextColor}
            size={18}
          />
          <Text numberOfLines={1} style={styles.categoryTextBold}>
            {strings.musicCategory}:
            <Text style={styles.categoryText}>
              {' '}
              {musicTypeName || 'Variada'}
            </Text>
          </Text>
        </View>

        <View style={styles.connectionsCont}>
          <Icon size={16} color="#fff" name="people" />
          <Text style={styles.connectionsCount}>{spotConnections || '0'}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cardSpot: {
    height: 170,
    width: window.width * 0.5,
    maxWidth: 400,
    backgroundColor: config.primaryColor,
  },
  backContainer: {
    backgroundColor: '#000000a0',
    flex: 1,
  },
  spotContainer: {
    flex: 1,
    padding: 10,
    paddingBottom: 0,
  },
  spotName: {
    fontFamily: config.fontBold,
    color: '#fff',
    fontSize: 18,
  },
  spotDescription: {
    fontFamily: config.fontRegular,
    fontSize: 12,
    color: '#fff',
  },
  spotCategory: {
    height: 40,
    backgroundColor: config.primaryDarkColor,
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 2,
  },
  categoryText: {
    fontSize: 16,
    fontFamily: config.fontLight,
    color: config.accentColor,
  },
  categoryTextBold: {
    fontSize: 16,
    fontFamily: config.fontLight,
    color: config.primaryTextColor,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 3,
  },
  absoluteDeleteIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  connectionsCont: {
    position: 'absolute',
    top: 7,
    right: 7,
    backgroundColor: '#00000080',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionsCount: {
    fontSize: 12,
    fontFamily: config.fontRegular,
    color: '#fff',
    marginLeft: 3,
    marginTop: 2,
  },
});
