import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import * as config from '../constants/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import {SongVM} from '../../../web/src/core/domain/music/Music';

type TrackItemProps = {
  item: SongVM;
  onPressPost?: (song: SongVM) => void;
  onPressPreview?: (song: SongVM) => void;
};

const TrackItem: React.FC<TrackItemProps> = props => {
  const handlePost = () => {
    if (props.onPressPost) {
      props.onPressPost(props.item);
    }
  };

  const handlePreviewVideo = () => {
    props.onPressPreview?.(props.item);
  };

  let {
    title,
    artistName,
    albumTitle,
    pictureSmall,
    pictureMedium,
    durationFormatted,
    isAlreadyInPlaylist,
  } = props.item;

  const subtitle = `${artistName}${albumTitle ? ` - ${albumTitle}` : ''}`;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePreviewVideo}>
        <ImageBackground
          style={styles.videoPreview}
          source={{uri: pictureSmall || pictureMedium}}>
          <Icon size={40} color="#fffffff0" name="play-arrow" />
          <View style={styles.durationCont}>
            <Text style={styles.duration}>{durationFormatted}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      <View style={{flex: 1, paddingLeft: 10}}>
        <Text numberOfLines={2} style={styles.videoTitle}>
          {title}
        </Text>
        <Text style={styles.videoInfo}>{subtitle}</Text>
      </View>
      {isAlreadyInPlaylist ? (
        <Animatable.View
          animation={'bounceIn'}
          duration={300}
          style={styles.postedSuccess}>
          <Icon name="done" size={18} color="#fff" />
        </Animatable.View>
      ) : (
        <TouchableOpacity onPress={handlePost}>
          <Icon size={26} color={config.accentColor} name="add-circle" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: config.primaryDarkColor,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    marginHorizontal: 10,
    shadowOffset: {width: 2, height: 3},
    shadowColor: 'black',
    shadowOpacity: 1.0,
    paddingRight: 10,
  },
  videoPreview: {
    backgroundColor: '#000',
    height: 60,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTitle: {
    fontSize: 12,
    fontFamily: config.fontRegular,
    color: config.primaryTextColor,
  },
  videoInfo: {
    fontSize: 10,
    fontFamily: config.fontRegular,
    color: config.primaryDarkTextColor,
  },
  suggestions: {
    margin: 10,
    marginBottom: 0,
    fontFamily: config.fontRegular,
    color: config.primaryTextColor,
    fontSize: 12,
  },
  durationCont: {
    position: 'absolute',
    right: 3,
    bottom: 3,
    padding: 3,
    backgroundColor: '#000000a0',
    borderRadius: 3,
    paddingVertical: 2,
  },
  duration: {
    color: config.primaryTextColor,
    fontSize: 10,
    fontFamily: config.fontBold,
  },
  postedSuccess: {
    backgroundColor: 'green',
    padding: 3,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  postedSuccessText: {
    color: '#fff',
    fontFamily: config.fontRegular,
    fontSize: 10,
  },
});

export default TrackItem;
