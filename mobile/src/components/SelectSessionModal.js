import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import * as config from '../constants/config';
const window = Dimensions.get('window');

export default class SelectSessionModal extends Component {
  _handleHide = () => {
    this.props.onHide();
  };
  render() {
    return (
      <Modal
        animationType={'fade'}
        visible={this.props.visible}
        transparent={true}
        onRequestClose={this._handleHide}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => this._handleHide()}>
          <View style={styles.cont}></View>
        </TouchableHighlight>
        <View style={styles.card}>
          <Text style={styles.message}>
            Se ha detectado otra sesión activa, selecciona el rol que quieres
            tener en este dispositivo
          </Text>
          <View style={styles.actionsCont}>
            <TouchableOpacity onPress={this._handleHide}>
              <Text style={[styles.action]}>ADMINISTRAR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.onPressAdmin}>
              <Text style={[styles.action, {color: config.accentColor}]}>
                REPRODUCTOR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    maxWidth: window.width - 100,
  },
  cont: {
    height: window.height - 20,
    padding: 20,
    backgroundColor: '#000000b0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    maxHeight: 180,
    backgroundColor: config.primaryDarkColor,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'absolute',
    top: window.height * 0.5 - 90,
    width: window.width - 40,
    left: 20,
  },
  message: {
    fontFamily: config.fontRegular,
    textAlign: 'center',
    color: config.primaryDarkTextColor,
  },
  actionsCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  action: {
    fontSize: 12,
    fontFamily: config.fontBold,
    width: 130,
    textAlign: 'center',
    color: config.primaryDarkTextColor,
  },
});
