import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  BackHandler,
} from 'react-native';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import * as config from '../constants/config';

export default class BottomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  _handleHide = () => {
    if (this.props.onHide) this.props.onHide();
    BackHandler.removeEventListener('hardwareBackPress', this.backListener);
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible === true && this.props.visible === false) {
      this.setState({ visible: true });
      BackHandler.addEventListener('hardwareBackPress', this.backListener);
    } else if (
      nextProps.visible === false &&
      this.props.visible === true &&
      this.mainCont
    ) {
      this.mainCont.fadeOut(400).then(() => {
        this.setState({ visible: false });
        if (this.props.onHide) this.props.onHide();
      });
      this.slider.slideOutDown(300).then(() => {});
    }
  }
  backListener = () => {
    this._handleHide();
    return true;
  };
  render() {
    if (this.state.visible)
      return (
        <Animatable.View
          ref={ref => (this.mainCont = ref)}
          style={styles.mainCont}
          duration={300}
          animation="fadeIn"
        >
          <Animatable.View
            ref={ref => (this.slider = ref)}
            animation="slideInUp"
            duration={400}
            style={styles.content}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text numberOfLines={1} style={styles.title}>
                {this.props.videoTitle}
              </Text>
              <TouchableOpacity
                onPress={this._handleHide}
                style={{ padding: 5, paddingTop: 0, paddingRight: 0 }}
              >
                <MdIcon name="clear" color={'#808080'} size={18} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>{this.props.children}</View>
          </Animatable.View>
        </Animatable.View>
      );
    else return null;
  }
}

const styles = StyleSheet.create({
  mainCont: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    padding: 7,
    elevation: 20,
  },
  content: {
    height: 157,
    width: 133,
    padding: 5,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    elevation: 20,
    margin: 10,
    marginRight: 0,
  },
  title: {
    fontSize: 10,
    flex: 1,
    fontFamily: config.fontRegular,
    paddingLeft: 3,
    marginTop: 2,
  },
});
