import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  Keyboard,
  Modal,
  FlatList,
  ToastAndroid,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {Actions} from 'react-native-router-flux';
import moment from 'moment';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import {TabView, TabBar} from 'react-native-tab-view';
import * as config from '../constants/config';
import AppToolbar from './Toolbar';
import ImageMiddleBackground from './ImageMiddleBackground';
import CurrentTrackPlayer from './CurrentTrackPlayer';
import firebase from 'react-native-firebase';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';
import strings from '../constants/translations';

const window = Dimensions.get('window');
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class PostedSongDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      commentsArr: [],
      index: 0,
      routes: [
        {
          key: 'first',
          title: strings.comments.toUpperCase(),
          icon: 'comments',
        },
        {key: 'second', title: 'LIKES', icon: 'thumbs-up'},
        {key: 'three', title: 'DISLIKES', icon: 'thumbs-down'},
      ],
    };
  }

  _handleIndexChange = index => this.setState({index});

  handleReportComment = comment => {
    this.props.onHide();
    Actions.reportModal({
      reportType: 'comment',
      reportedUser: comment.uid,
      commentId: comment.id,
      comment: comment.comment,
      userWhoReport: this.props.uid,
    });
  };

  _handlePressOption = (option, comment) => {
    switch (option) {
      case 'REPORT_COMMENT':
        this.handleReportComment(comment);
        break;
      case 'BLOCK_USER':
        this.props.onPressBlockUser(comment.uid);
        break;
      case 'UNBLOCK_USER':
        this.props.onPressUnblockUser(comment.uid);
        break;
      default:
        break;
    }
  };

  _renderHeader = props => (
    <View style={{width: window.width}}>
      <TabBar
        {...props}
        renderLabel={this._renderLabel}
        labelStyle={{color: config.primaryDarkTextColor}}
        indicatorStyle={styles.tabIndicatorStyle}
        style={styles.tabBarStyle}
      />
    </View>
  );

  _renderLabel = scene => {
    let count = 0;
    switch (scene.route.title) {
      case strings.comments.toUpperCase():
        count = this.props.comments
          ? Object.keys(this.props.comments).length
          : 0;
        break;
      case 'LIKES':
        // if (this.props.video && this.props.video.usersWhoReact) {
        //     Object.values(this.props.video.usersWhoReact).forEach(item => {
        //         if (item.reaction === true) {
        //             count += 1
        //         }
        //     })
        // }
        break;
      case 'DISLIKES':
        // if (this.props.video && this.props.video.usersWhoReact) {
        //     Object.values(this.props.video.usersWhoReact).forEach(item => {
        //         if (item.reaction === false) {
        //             count += 1
        //         }
        //     })
        // }
        break;
      default:
        break;
    }
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* <Icon
                    color={config.primaryDarkTextColor}
                    name={scene.route.icon} size={18} /> */}
        <Text style={styles.labelStyle}>{scene.route.title}</Text>
      </View>
    );
  };

  _renderUser(user, reactionType) {
    const {item} = user;
    if (item.reaction === reactionType) {
      return (
        <View style={styles.userItem}>
          <Image style={styles.userImage} source={{uri: item.avatar}} />
          <Text style={styles.username}>{item.name}</Text>
        </View>
      );
    } else return null;
  }

  _renderUsersList(reactionType) {
    if (this.props.song && this.state.reactionsArr) {
      return (
        <View style={{flex: 1}}>
          <FlatList
            renderItem={item => this._renderUser(item, reactionType)}
            keyExtractor={item => item.uid + '_reaction'}
            data={
              Array.isArray(this.state.reactionsArr)
                ? this.state.reactionsArr
                : []
            }
            contentContainerStyle={[styles.container, {paddingTop: 0}]}
          />
        </View>
      );
    }
  }

  _renderComment = comment => {
    const {item} = comment;
    const {publishedAt} = item;
    let diffTime = moment().diff(moment(publishedAt), 'seconds');
    let diffString = 'segundo';
    if (diffTime > 3600 * 24) {
      diffString = 'dia';
      diffTime = (diffTime / (3600 * 24)).toFixed(0);
    } else if (diffTime > 3600) {
      diffString = 'hora';
      diffTime = (diffTime / 3600).toFixed(0);
    } else if (diffTime > 60) {
      diffString = 'minuto';
      diffTime = (diffTime / 60).toFixed(0);
    }
    return (
      <View style={styles.commentItem}>
        <Image style={styles.publisherImage} source={{uri: item.avatar}} />
        <View style={{flex: 1, paddingLeft: 10}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 5,
            }}>
            <Text
              numberOfLines={1}
              style={[styles.accentText, {paddingRight: 10}]}>
              {item.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={styles.infoText}>
                Hace {diffTime}{' '}
                {diffTime === '1' ? diffString : diffString + 's'}
              </Text>
              {this.props.uid !== item.uid ? (
                <View style={styles.menuContainer}>
                  <Menu
                    onSelect={option => this._handlePressOption(option, item)}>
                    <MenuTrigger>
                      <View
                      //onPress={props.onPressMenu}
                      >
                        <MdIcon
                          style={{marginTop: 3, marginLeft: 1}}
                          color="#fff"
                          size={18}
                          name="more-vert"
                        />
                      </View>
                    </MenuTrigger>
                    <MenuOptions
                      customStyles={{optionText: styles.optionText}}
                      optionsContainerStyle={styles.menu}>
                      {this.props.isAdmin &&
                      this.props.uid !== item.uid &&
                      !this.props.blockedUsers[item.uid] ? (
                        <MenuOption
                          text={strings.blockUser}
                          value="BLOCK_USER"
                        />
                      ) : null}
                      {this.props.isAdmin &&
                      this.props.uid !== item.uid &&
                      this.props.blockedUsers[item.uid] ? (
                        <MenuOption
                          text={strings.unblockUser}
                          value="UNBLOCK_USER"
                        />
                      ) : null}
                      {this.props.uid !== item.uid ? (
                        <MenuOption
                          text={strings.report}
                          value="REPORT_COMMENT"
                        />
                      ) : null}
                    </MenuOptions>
                  </Menu>
                </View>
              ) : null}
            </View>
          </View>
          <Text style={[styles.infoText, {fontSize: 12}]}>
            <Text style={{color: '#808080'}}>Comentó:</Text> {item.comment}
          </Text>
        </View>
      </View>
    );
  };

  _renderScene = ({route}) => {
    if (route.title == strings.comments.toUpperCase()) {
      return (
        <View style={{flex: 1}}>
          <FlatList
            keyExtractor={item => `${item.id}`}
            renderItem={this._renderComment}
            data={this.state.commentsArr}
            ref={comp => (this.scrollView = comp)}
            contentContainerStyle={[
              styles.container,
              {paddingTop: 10, paddingBottom: 60},
            ]}
          />
          <View style={styles.inputCont}>
            <TextInput
              maxLength={240}
              onChangeText={text => this.setState({commentText: text})}
              value={this.state.commentText}
              underlineColorAndroid="transparent"
              placeholderTextColor={config.primaryDarkTextColor}
              placeholder={strings.comment}
              style={styles.input}
            />
            {!this.state.lastSentTime ? (
              <Ripple
                onPress={this._handleSendComment}
                style={{
                  width: 40,
                  height: 40,
                  marginLeft: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MdIcon color={config.accentColor} size={26} name={'send'} />
              </Ripple>
            ) : (
              <Text style={styles.timer}>{this.state.lastSentTime}s</Text>
            )}
          </View>
        </View>
      );
    } else if (route.title == 'LIKES' && this.state.index === 1) {
      return this._renderUsersList(true);
    } else if (route.title == 'DISLIKES' && this.state.index === 2) {
      return this._renderUsersList(false);
    } else {
      return <View />;
    }
  };

  _handleHide = () => {
    this.setState({visible: false});
    if (this.props.onHide) this.props.onHide();
  };

  _handleSendComment = () => {
    if (this.props.onSendComment && this.state.commentText) {
      this.props.onSendComment(this.state.commentText);
      this.setState({commentText: '', lastSentTime: 30});
      this.spamAvoidingTimer = setInterval(() => {
        if (this.state.lastSentTime - 1 === -1) {
          clearInterval(this.spamAvoidingTimer);
        } else {
          this.setState({lastSentTime: this.state.lastSentTime - 1});
        }
      }, 1000);
      Keyboard.dismiss();
    }
  };

  componentWillReceiveProps(nextProps) {
    if (
      (!nextProps.song || !nextProps.song.song) &&
      this.props.song &&
      this.props.song.song &&
      this.props.visible === true
    ) {
      ToastAndroid.show(
        'La canción ya no esta en la lista de postulaciones',
        ToastAndroid.LONG,
      );
      this.commentsRef.off('value');
      this.setState({commentsArr: [], reactionsArr: []});
      if (this.props.onHide) this.props.onHide();
    }
    if (
      nextProps.songId &&
      nextProps.visible === true &&
      this.props.visible === false
    ) {
      this.commentsRef = firebase
        .database()
        .ref(
          `publishedVideoComments/${this.props.selectedSpot.id}/${nextProps.songId}`,
        );
      this.commentsRef.on('value', snapshot => {
        const results = snapshot.val();
        if (results) {
          let commentsArr = [];
          commentsArr = Object.keys(results).map(item => {
            return {...results[item], id: item};
          });

          commentsArr = commentsArr.sort((a, b) => {
            return a.publishedAt - b.publishedAt;
          });

          commentsArr.reverse();
          this.setState({commentsArr});
          if (commentsArr.length > this.state.commentsArr.length) {
            setTimeout(() => {
              if (this.scrollView) {
                this.scrollView.scrollToOffset({animated: false, offset: 0});
              }
            }, 600);
          }
        } else {
          this.setState({commentsArr: []});
        }
      });
      this.reactionsRef = firebase
        .database()
        .ref(
          `publishedVideoReactions/${this.props.selectedSpot.id}/${nextProps.songId}`,
        );
      this.reactionsRef.once('value').then(snapshot => {
        const results = snapshot.val();
        if (results) {
          let reactionsArr = [];
          reactionsArr = Object.values(results);
          this.setState({reactionsArr});
        } else {
        }
      });
      // let commentsArr = []
      // commentsArr = Object.values(nextProps.comments).sort((a, b) => {
      //     return a.publishedAt - b.publishedAt
      // })
      // this.setState({ commentsArr })
      // if (commentsArr.length > this.state.commentsArr.length) {
      //     setTimeout(() => {
      //         if (this.scrollView) {
      //             this.scrollView.scrollToOffset({ animated: false, offset: 0 })
      //         }
      //     }, 600)
      // }
    }
    if (nextProps.visible === true && this.props.visible === false) {
      setTimeout(() => {
        if (this.scrollView) {
          this.scrollView.scrollToOffset({animated: false, offset: 0});
        }
      }, 1000);
    } else if (nextProps.visible === false && this.props.visible === true) {
      this.setState({commentsArr: []});
      this.commentsRef.off('value');
      if (this.props.onHide) this.props.onHide();
    }
  }

  render() {
    const {song} = this.props;
    return (
      <Modal
        onRequestClose={this.props.onHide}
        animationType="slide"
        visible={this.props.visible}>
        <MenuProvider skipInstanceCheck>
          <ImageMiddleBackground
            image={
              song && song.song ? song.song.album.cover_medium : undefined
            }>
            <KeyboardAvoidingView
              style={{flex: 1}}
              behavior="padding"
              enabled={Platform.OS === 'ios'}>
              <AppToolbar
                containerStyle={{
                  elevation: 0,
                  backgroundColor: 'transparent',
                  height: 50,
                }}
                onLeftElementPress={this.props.onHide}
                title={
                  this.props.selectedSpot ? this.props.selectedSpot.name : ''
                }
                leftElement="chevron-left"
              />
              {this.props.song && this.props.song.song ? (
                <CurrentTrackPlayer
                  noPlay
                  // thumbnailStyle={{ margin: 3, height: 94 }}
                  song={this.props.song}
                />
              ) : null}
              <TabView
                canJumpToTab={() => true}
                style={{flex: 1}}
                navigationState={this.state}
                renderScene={this._renderScene}
                renderTabBar={this._renderHeader}
                onIndexChange={this._handleIndexChange}
                initialLayout={initialLayout}
              />
            </KeyboardAvoidingView>
          </ImageMiddleBackground>
        </MenuProvider>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  cont: {
    height: window.height - 20,
    backgroundColor: '#00000070',
  },
  content: {
    position: 'absolute',
    height: '100%',
    left: 0,
    bottom: 0,
    width: window.width,
    backgroundColor: 'white',
    elevation: 20,
    zIndex: 10001,
  },
  container: {
    padding: 10,
    paddingBottom: 60,
  },
  publisherImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  accentText: {
    fontFamily: config.fontBold,
    fontSize: 12,
    color: config.primaryTextColor,
  },
  infoText: {
    fontFamily: config.fontRegular,
    fontSize: 10,
    color: config.primaryDarkTextColor,
  },
  commentItem: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 5,
    backgroundColor: config.primaryColor,
    borderRadius: 4,
    elevation: 3,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 2,
    shadowColor: 'black',
    shadowOpacity: 0.8,
  },
  commentsCont: {},
  divider: {
    height: 1,
    backgroundColor: '#e9e9e9',
  },
  inputCont: {
    height: 50,
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingLeft: 20,
    paddingRight: 10,
    left: 10,
    width: window.width - 20,
    backgroundColor: config.primaryDarkColor,
    color: config.primaryTextColor,
    borderRadius: 4,
  },
  input: {
    flex: 1,
    height: 35,
    paddingLeft: 10,
    borderRadius: 17,
    backgroundColor: config.primaryDarkColor,
    paddingTop: 0,
    paddingBottom: 0,
    fontFamily: config.fontRegular,
    color: config.primaryDarkTextColor,
  },
  count: {
    color: '#a0a0a0',
    fontFamily: config.fontRegular,
    textAlign: 'right',
    marginRight: 10,
  },
  labelStyle: {
    color: config.primaryDarkTextColor,
    fontSize: 10,
    fontFamily: config.fontRegular,
    marginTop: 5,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: config.primaryDarkTextColor,
    fontSize: 14,
    fontFamily: config.fontBold,
  },
  tabBarStyle: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 40,
  },
  tabIndicatorStyle: {
    backgroundColor: config.accentColor,
    // width: (window.width - 40) * 0.333,
    // maxWidth: (window.width - 40) * 0.333,
    // marginLeft: -5,
  },
  timer: {
    fontFamily: config.fontRegular,
    color: config.primaryDarkTextColor,
  },
  menu: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    elevation: 8,
    paddingLeft: 10,
    margin: 5,
    marginTop: 0,
  },
  menuContainer: {
    // position: 'absolute',
    // left: 0,
    // top: 0
  },
  optionText: {
    color: '#404040',
    margin: 5,
    fontFamily: config.fontRegular,
  },
});
