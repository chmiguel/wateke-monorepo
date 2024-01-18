import React from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity
} from 'react-native'
import * as config from '../constants/config'
import Icon from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'
import strings from '../constants/translations'

const window = Dimensions.get('window')

export default class PrivacySelection extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  handleSelectPublic = () => {
    if (this.props.onChangePrivacy) {
      this.props.onChangePrivacy(true)
    }
  }

  handleSelectPrivate = () => {
    if (this.props.onChangePrivacy) {
      this.props.onChangePrivacy(false)
    }
  }

  // handleTogglePlaylist = () => {
  //   if (this.props.onChangePlaylist) {
  //     this.props.onChangePlaylist(!this.props.playlist)
  //   }
  // }

  // handleToggleBlockPost = () => {
  //   if (this.props.onChangeBlockPost) {
  //     this.props.onChangeBlockPost(!this.props.blockPost)
  //   }
  // }

  render() {
    return (
      <LinearGradient
        colors={[config.primaryColor, 'transparent']}
        style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={this.handleSelectPublic}
            style={styles.toggleContainer}>
            <Icon
              size={26}
              color={this.props.isPublicSpot ? config.accentColor : config.primaryDarkTextColor}
              name={this.props.isPublicSpot ? 'radio-button-checked' : 'radio-button-unchecked'}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
            <Icon
              size={26}
              color={config.primaryTextColor}
              name={'language'}
            />
            <View style={{ paddingLeft: 5, paddingRight: 10 }}>
              <Text style={styles.title}>
                {strings.public}
            </Text>
              <Text style={styles.description}>
                {strings.publicSpotDesc}
            </Text>
            </View>
          </View>
        </View>
        <View style={[styles.row, { marginVertical: 10 }]}>
          <TouchableOpacity
            onPress={this.handleSelectPrivate}
            style={styles.toggleContainer}>
            <Icon
              size={26}
              color={!this.props.isPublicSpot ? config.accentColor : config.primaryDarkTextColor}
              name={!this.props.isPublicSpot ? 'radio-button-checked' : 'radio-button-unchecked'}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
            <Icon
              size={26}
              color={config.primaryTextColor}
              name={'lock'}
            />
            <View style={{ paddingLeft: 5 }}>
              <Text style={styles.title}>
                {strings.private}
              </Text>
              <Text style={styles.description}>
                {strings.privateSpotDesc}
              </Text>
            </View>
          </View>
        </View>
        
      </LinearGradient>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    minHeight: 220
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: config.primaryTextColor,
    fontSize: 16,
    fontFamily: config.fontBold,
  },
  description: {
    color: config.primaryDarkTextColor,
    fontSize: 12,
    fontFamily: config.fontRegular,
    maxWidth: window.width - 130
  },
  toggleContainer: {
    width: 26
  },
  sectionTitle: {
    fontSize: 16,
    color: config.primaryTextColor,
    fontFamily: config.fontRegular,
    marginBottom: 20
  }
})
