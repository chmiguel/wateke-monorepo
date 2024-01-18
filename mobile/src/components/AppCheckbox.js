import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as config from '../constants/config'
export default class AppCheckbox extends PureComponent {

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          opacity={1.0}
          onPress={this.props.onPress}>
          <Icon
            color={this.props.checked ? config.accentColor : 'grey'}
            size={26}
            name={this.props.checked ? this.props.checkedIcon || 'check-box' : this.props.unCheckedIcon || 'check-box-outline'} />
        </TouchableOpacity>
        <Text style={[styles.label, this.props.labelStyle]}>
          {this.props.label}
        </Text>
      </View>
    )

  }
}
const styles = StyleSheet.create({
  container: {
    marginLeft: 0,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 125,
  },
  label: {
    marginLeft: 5,
    color: 'black'
  }
})
