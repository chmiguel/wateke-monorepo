import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as config from '../constants/config';
import DeezerModule from '../DeezerModule';

export default class PreviewSongPlayer extends Component {
  state = {
    initialized: false,
    playerState: null,
  };

  async componentDidMount() {
    DeezerModule.isPlayerInitialized().then(initialized => {
      this.setState({initialized});
    });
    DeviceEventEmitter.addListener(
      'ACTIVE_PLAYER_CHANGE',
      this.activePlayerListener,
    );
  }

  activePlayerListener = active => {
    this.setState({activePlayer: active});
  };

  componentWillUnmount() {
    DeezerModule.stopPlayer();
    DeviceEventEmitter.removeListener(
      'ACTIVE_PLAYER_CHANGE',
      this.activePlayerListener,
    );
  }

  playerStateListener = state => {
    this.setState({playerState: state});
    if (this.props.onChangeState) {
      this.props.onChangeState(state);
    }
  };

  playerProgressListener = progress => {};

  handlePressPlay = () => {
    const {initialized, playerState, activePlayer} = this.state;
    const {song} = this.props;
    DeezerModule.setActivePlayer('preview');
    if (initialized) {
      if (playerState === 'PAUSED' && activePlayer === 'preview') {
        DeezerModule.resumePlayer();
      } else {
        DeezerModule.stopPlayer();
        DeezerModule.playTrack(song.id);
      }
      this.setState({playerState: 'PLAYING'});
    } else {
      DeezerModule.authenticateWithVerification()

        .then(result => {
          if (initialized) {
            return true;
          }
          return DeezerModule.initializePlayer();
        })
        .then(() => {
          if (song && song.id) {
            DeezerModule.stopPlayer();
            DeezerModule.playTrack(song.id);
            this.setState({initialized: true, playerState: 'PLAYING'});
          }
        });
    }
  };

  componentWillReceiveProps(nextProps) {
    const {initialized} = this.state;
    if (
      !this.props.song ||
      (nextProps.song &&
        nextProps.song &&
        nextProps.song.id !== this.props.song.id &&
        initialized)
    ) {
      DeezerModule.stopPlayer();
      DeezerModule.playTrack(nextProps.song.id);
    }
  }

  componentDidCatch() {
    DeezerModule.stopPlayer();
    DeviceEventEmitter.removeListener(
      'DEEZER_PLAYER_STATE',
      this.playerStateListener,
    );
    DeviceEventEmitter.removeListener(
      'DEEZER_PLAYER_PROGRESS',
      this.playerProgressListener,
    );
    DeviceEventEmitter.removeListener(
      'ACTIVE_PLAYER_CHANGE',
      this.activePlayerListener,
    );
  }

  handlePressPause = () => {
    DeezerModule.pausePlayer();
    this.setState({playerState: 'PAUSED'});
  };

  render() {
    const {playerState, activePlayer} = this.state;
    const {song} = this.props;
    return (
      <ImageBackground
        source={song ? {uri: song.album.cover_medium} : undefined}
        style={[styles.container, this.props.containerStyle]}>
        {playerState === 'PLAYING' && activePlayer === 'preview' ? (
          <TouchableOpacity onPress={this.handlePressPause}>
            <Icon size={45} color="#ffffffb0" name="pause-circle-filled" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.handlePressPlay}>
            <Icon size={45} color="#ffffffb0" name="play-circle-filled" />
          </TouchableOpacity>
        )}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },

  absoluteContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  publisherCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  descriptionCont: {
    padding: 10,
    paddingBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  publisherName: {
    color: config.primaryTextColor,
    fontSize: 12,
    fontFamily: config.fontRegular,
  },
  publishInfo: {
    color: config.primaryDarkTextColor,
    fontSize: 10,
    fontFamily: config.fontRegular,
  },
  videoTitle: {
    color: config.primaryTextColor,
    fontSize: 16,
    fontFamily: config.fontBold,
  },
  videoChannel: {
    color: config.primaryDarkTextColor,
    fontSize: 14,
    fontFamily: config.fontRegular,
    marginTop: -2,
  },
});
