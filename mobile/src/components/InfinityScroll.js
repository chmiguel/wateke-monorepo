import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as config from '../constants/config';
const window = Dimensions.get('window');
export default class ScrollInfinite extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  isCloseToEnd({layoutMeasurement, contentOffset, contentSize}) {
    let height1 = Math.round(layoutMeasurement.height + contentOffset.y);
    let height2 = Math.floor(contentSize.height);
    return height1 >= height2 - 60;
  }
  _handleScroll = event => {
    if (this.isCloseToEnd(event.nativeEvent)) {
      let items = this.props.dataLength || this.props.children.length;

      if (items % this.props.itemsPerPage == 0) {
        let pagina = Math.floor(items / this.props.itemsPerPage) + 1;
        if (this.props.isFetchingMore == false) {
          if (this.props.onEnd) {
            this.props.onEnd(pagina);
          }
        }
      }
    }
  };
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.isFetchingMore == true &&
      this.props.isFetchingMore == false
    ) {
    }
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={this.props.contentContainerStyle}
        refreshControl={this.props.refreshControl}
        ref={comp => (this.scrollView = comp)}
        scrollEventThrottle={400}
        onScroll={this._handleScroll}>
        {this.props.children}
        {this.props.isFetchingMore ? (
          <View style={{minHeight: 60, paddingTop: 20, alignItems: 'center'}}>
            <ActivityIndicator
              color={config.primaryColor}
              animated={true}
              size="large"
            />
          </View>
        ) : null}
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
