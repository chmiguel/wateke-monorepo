import React, {ReactElement} from 'react';
import {Image, View, StyleSheet, Dimensions, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as config from '../constants/config';

const {width} = Dimensions.get('window');

type Props = {
  style?: ViewStyle;
  noImage?: boolean;
  imageContainerStyle?: ViewStyle;
  image?: string;
  children: ReactElement | ReactElement[];
};

const ImageMiddleBackground = (props: Props) => {
  return (
    <View style={[styles.container, props.style]}>
      {!props.noImage ? (
        <View style={[{height: 156}, props.imageContainerStyle]}>
          {props.image ? (
            <Image style={styles.imageStyle} source={{uri: props.image}} />
          ) : null}
          <LinearGradient
            style={styles.backImage}
            colors={['#1d262c', 'rgba(29, 38, 44, 0.7)']}
          />
        </View>
      ) : null}
      <View style={{flex: 1}} />

      {/* <Image
        style={styles.peopleBackStyle}
        source={require('../assets/images/people-back.png')}
      /> */}

      <View style={styles.childrenContainer}>{props.children}</View>
    </View>
  );
};

export default ImageMiddleBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.backScreensColor,
  },
  imageStyle: {
    width: width,
    height: '100%',
    resizeMode: 'cover',
  },
  backImage: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  peopleBackStyle: {
    width: '100%',
    height: 170,
    resizeMode: 'cover',
  },
  childrenContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});
