'use strict';

import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import * as config from '../constants/config';
import strings from '../constants/translations';

class PickImage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  _handlePickImage = () => {
    // More info on all the options is below in the README...just some common use cases shown here
    let options = {
      title: strings.uploadCoverPicture,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      takePhotoButtonTitle: strings.fromCamera,
      chooseFromLibraryButtonTitle: strings.fromGallery,
      mediaType: 'photo',
    };
    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info below in README)
     */
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        if (this.props.onPhotoChanged) {
          this.props.onPhotoChanged('selectedImage', {uri: response.uri});
        }
        this.setState({selectedImage: {uri: response.uri}});
      }
    });
  };
  render() {
    if ((this.props.value || this.state.selectedImage) && !this.props.noImage) {
      return (
        <TouchableOpacity onPress={this._handlePickImage}>
          <ImageBackground
            style={[styles.container]}
            source={this.props.value || this.state.selectedImage}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={this._handlePickImage}
          style={[styles.container, this.props.containerStyle]}>
          <Text
            style={[
              styles.pickText,
              {color: this.props.error ? 'red' : config.accentTextColor},
            ]}>
            {this.props.placeholder || 'SUBE UNA FOTO DE PORTADA'}
          </Text>
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#c0c0c0',
    height: 110,
    width: 220,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4,
  },
  pickText: {
    color: config.accentTextColor,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: config.fontLight,
    borderRadius: 4,
  },
});

export default PickImage;
