import React, {PureComponent} from 'react';
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
import strings from '../constants/translations';

const window = Dimensions.get('window');

export default class ActionModal extends PureComponent {
  _handleHide = () => {
    if (this.props.cancelAction) {
      this.props.cancelAction();
    }
    this.props.onHide();
  };
  render() {
    return (
      <Modal
        animationType={'fade'}
        visible={this.props.visible !== undefined ? this.props.visible : false}
        transparent={true}
        onRequestClose={this.props.onHide}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={this.props.onHide}>
          <View style={styles.cont}></View>
        </TouchableHighlight>
        <View style={styles.card}>
          <Text style={styles.message}>{this.props.message}</Text>
          <View style={styles.actionsCont}>
            {this.props.cancelAction === null ? (
              <View style={{width: 0}} />
            ) : (
              <TouchableOpacity onPress={this._handleHide}>
                <Text style={[styles.action]}>
                  {this.props.cancelText || strings.cancel}
                </Text>
              </TouchableOpacity>
            )}
            {this.props.acceptAction ? (
              <TouchableOpacity onPress={this.props.acceptAction}>
                <Text style={[styles.action, {color: config.accentColor}]}>
                  {this.props.acceptText || strings.accept}
                </Text>
              </TouchableOpacity>
            ) : null}
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
