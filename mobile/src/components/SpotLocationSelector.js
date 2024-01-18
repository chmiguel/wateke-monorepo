import React, {Component} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import * as config from '../constants/config';
import MapView from 'react-native-maps';
import GooglePlaces from './GooglePlaces';
import LinearGradient from 'react-native-linear-gradient';
import strings from '../constants/translations';

const window = Dimensions.get('window');

export default class SpotLocationSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  _handleSelectLocation = (data, details) => {
    if (details.geometry && details.geometry.location) {
      let latitude = details.geometry.location.lat;
      let longitude = details.geometry.location.lng;
      if (this.props.onPressSave) {
        this.props.onPressSave({
          x: {latitude, longitude},
          address: details.formatted_address,
        });
      }
      this.setState({
        x: {latitude, longitude},
        address: details.formatted_address,
        region: {
          latitude,
          longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.02,
        },
      });
    }
  };

  _handleDragMarker = e => {
    if (this.props.onPressSave) {
      this.props.onPressSave({
        address: this.state.address,
        x: e.nativeEvent.coordinate,
      });
    }
    this.setState({
      x: e.nativeEvent.coordinate,
      region: {
        ...e.nativeEvent.coordinate,
        latitudeDelta: 0.008,
        longitudeDelta: 0.02,
      },
    });
  };

  _handleSaveLocation = () => {
    if (this.props.onPressSave) {
      this.props.onPressSave(this.state);
    }
  };
  render() {
    return (
      <LinearGradient
        colors={[config.primaryColor, 'transparent']}
        style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView
            ref={comp => (this._mapa = comp)}
            style={styles.mapa}
            showsMyLocationButton={false}
            region={this.state.region}
            rotateEnabled={false}
            onRegionChangeComplete={() =>
              this._marker ? this._marker.showCallout() : null
            }
            showsUserLocation={false}>
            {this.state.x ? (
              <MapView.Marker
                draggable
                ref={comp => (this._marker = comp)}
                coordinate={this.state.x}
                onDragEnd={this._handleDragMarker}
                description={strings.dragAndDrop}
                title={strings.newSpot}
              />
            ) : null}
          </MapView>
        </View>
        <View style={styles.inputCont}>
          <GooglePlaces onPress={this._handleSelectLocation} />
        </View>
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    height: window.height * 0.5,
    paddingTop: 65,
  },
  mapContainer: {
    flex: 1,
  },
  mapa: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  inputCont: {
    minHeight: 40,
    marginBottom: 10,
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
  },
});
