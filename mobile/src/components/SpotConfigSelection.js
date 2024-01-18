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

export default class SpotConfigSelection extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  handleFreeSpot=()=>{
    if (this.props.onChangePlaylist) {
        this.props.onChangePlaylist(false)
    }
    if (this.props.onChangeBlockPost) {
        this.props.onChangeBlockPost(false)
    }
  }

  handleTogglePlaylist = () => {
    if (this.props.onChangePlaylist) {
      this.props.onChangePlaylist(!this.props.playlist)
    }
  }

  handleToggleBlockPost = () => {
    if (this.props.onChangeBlockPost) {
      this.props.onChangeBlockPost(!this.props.blockPost)
    }
  }

  render() {
    return (
      <LinearGradient
        colors={[config.primaryColor, 'transparent']}
        style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={this.handleFreeSpot}
            style={styles.toggleContainer}>
            <Icon
              size={26}
              color={!this.props.blockPost&&!this.props.playlist ? config.accentColor : config.primaryDarkTextColor}
              name={!this.props.blockPost&&!this.props.playlist? 'check-box' : 'check-box-outline-blank'}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
            <Icon
              size={26}
              color={config.primaryTextColor}
              name={'queue-music'}
            />
            <View style={{ paddingLeft: 5, flex: 1 }}>
              <Text style={styles.title}>
                {strings.freeSpot}
              </Text>
              <Text style={styles.description}>
                {strings.freeSpotDesc}.
            </Text>
            </View>
          </View>
        </View>
        <View style={[styles.row, {marginTop: 10}]}>
          <TouchableOpacity
            onPress={this.handleToggleBlockPost}
            style={styles.toggleContainer}>
            <Icon
              size={26}
              color={this.props.blockPost ? config.accentColor : config.primaryDarkTextColor}
              name={this.props.blockPost ? 'check-box' : 'check-box-outline-blank'}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
            <Icon
              size={26}
              color={config.primaryTextColor}
              name={'queue-music'}
            />
            <View style={{ paddingLeft: 5, flex: 1 }}>
              <Text style={styles.title}>
                {strings.withPublishBocking}
              </Text>
              <Text style={styles.description}>
                {strings.withPublishBockingDesc}
            </Text>
            </View>
          </View>
        </View>
        <View style={[styles.row, {marginTop: 10}]}>
          <TouchableOpacity
            onPress={this.handleTogglePlaylist}
            style={styles.toggleContainer}>
            <Icon
              size={26}
              color={this.props.playlist ? config.accentColor : config.primaryDarkTextColor}
              name={this.props.playlist ? 'check-box' : 'check-box-outline-blank'}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
            <Icon
              size={26}
              color={config.primaryTextColor}
              name={'queue-music'}
            />
            <View style={{ paddingLeft: 5, flex: 1 }}>
              <Text style={styles.title}>
                {strings.asPlaylist}
              </Text>
              <Text style={styles.description}>
                {strings.asPlaylistDesc}
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
  }
})
