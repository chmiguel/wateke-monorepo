import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as config from '../constants/config';

export default class CurrentTrackPlayer extends PureComponent {
  render() {
    const { song, publisher } = this.props.song;
    const {
      title,
      artist: { name },
      album: { title: albumTitle },
    } = song;
    const subtitle = `${name} - ${albumTitle}`;
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={{ backgroundColor: 'black' }}>
          <View style={styles.absoluteContainer}>
            {!this.props.noPlay ? (
              <TouchableOpacity onPress={this.props.onPressPlay}>
                <Icon size={45} color="#ffffffb0" name="play-circle-filled" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <View style={styles.descriptionCont}>
          <View style={styles.videoDesc}>
            <Text numberOfLines={1} style={styles.videoTitle}>
              {title}
            </Text>
            <Text numberOfLines={1} style={styles.videoChannel}>
              {subtitle}
            </Text>
          </View>
          {/* <View style={styles.publisherCont}>
            <Image source={{ uri: publisher.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.publishInfo}>{strings.posted}:</Text>
              <Text style={styles.publisherName}>{publisher.name}</Text>
            </View>
          </View> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  videoThumbnail: {
    width: 120,
    height: 90,
    margin: 5,
    marginRight: 0,
    resizeMode: 'contain',
  },
  absoluteContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  publisherCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  descriptionCont: {
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  publisherName: {
    color: config.primaryTextColor,
    fontSize: 12,
    fontFamily: config.fontRegular,
  },
  publishInfo: {
    color: config.primaryDarkTextColor,
    fontSize: 10,
    fontFamily: config.fontRegular,
  },
  videoTitle: {
    color: config.primaryTextColor,
    fontSize: 16,
    fontFamily: config.fontBold,
  },
  videoChannel: {
    color: config.primaryDarkTextColor,
    fontSize: 14,
    fontFamily: config.fontRegular,
    marginTop: -2,
  },
});
