import React, {Component} from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ripple from 'react-native-material-ripple';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import moment from 'moment';
import * as config from '../constants/config';
import strings from '../constants/translations';
import {Actions} from 'react-native-router-flux';

export default class PostedVideo extends Component {
  shouldComponentUpdate(nextProps) {
    const {usersWhoLike} = nextProps.item;
    let likes = 0;
    let dislikes = 0;
    if (usersWhoLike) {
      Object.keys(usersWhoLike).forEach((item, i) => {
        if (usersWhoLike[item] === true) {
          likes = likes + 1;
        } else if (usersWhoLike[item] === false) {
          dislikes = dislikes + 1;
        }
      });
    }
    const {usersWhoLike: oldUsersWhoLike} = this.props.item;
    let oldLikes = 0;
    let oldDislikes = 0;
    if (oldUsersWhoLike) {
      Object.keys(oldUsersWhoLike).forEach((item, i) => {
        if (oldUsersWhoLike[item] === true) {
          oldLikes = oldLikes + 1;
        } else if (oldUsersWhoLike[item] === false) {
          oldDislikes = oldDislikes + 1;
        }
      });
    }
    return (
      oldLikes !== likes ||
      oldDislikes !== dislikes ||
      nextProps.commentsCount !== this.props.commentsCount ||
      nextProps.isNextVideo !== this.props.isNextVideo ||
      nextProps.isBlocked !== this.props.isBlocked
    );
  }

  _handlePressOption = (option, comment) => {
    switch (option) {
      case 'DELETE_VIDEO':
        this._handleDelete();
        break;
      case 'NEXT':
        this._handlePlay();
        break;
      case 'WATCH_COMMENTS':
        this._toggleComments();
        break;
      case 'BLOCK_USER':
        this.props.onPressBlockUser(this.props.item.publisher.uid);
        break;
      case 'UNBLOCK_USER':
        this.props.onPressUnblockUser(this.props.item.publisher.uid);
        break;
      case 'REPORT_VIDEO':
        Actions.reportModal({
          reportType: 'user',
          reportedUser: this.props.item.publisher.uid,
          spot: this.props.spotId,
          userWhoReport: this.props.uid,
          videoId: this.props.item.video.id.videoId,
        });
      default:
        break;
    }
  };

  _toggleComments = () => {
    if (this.props.item) {
      this.props.onPressWatchComments(
        this.props.listCommentIndex,
        this.props.item.id,
      );
    }
  };

  handlePressLike = () => {
    const {usersWhoLike} = this.props.item;
    if (this.props.onPressReact) {
      this.props.onPressReact(
        this.props.item,
        usersWhoLike && usersWhoLike[this.props.uid] === true ? null : true,
      );
    }
  };
  handlePressDislike = () => {
    const {usersWhoLike} = this.props.item;
    if (this.props.onPressReact) {
      this.props.onPressReact(
        this.props.item,
        usersWhoLike && usersWhoLike[this.props.uid] === false ? null : false,
      );
    }
  };

  _handlePreview = () => {
    if (this.props.onPressPlay) {
      this.props.onPressPlay(this.props.item, 1);
    }
  };

  _handlePlay = () => {
    if (this.props.onPressPlay) {
      this.props.onPressPlay(this.props.item, 0);
    }
  };
  _handleDelete = () => {
    if (this.props.onPressDelete) {
      this.props.onPressDelete(this.props.item);
    }
  };
  render() {
    let {publisher, video, usersWhoLike, commentsCount, publishDate} =
      this.props.item;
    let likes = 0;
    let dislikes = 0;
    if (usersWhoLike) {
      Object.keys(usersWhoLike).forEach((item, i) => {
        if (usersWhoLike[item] === true) {
          likes = likes + 1;
        } else {
          dislikes = dislikes + 1;
        }
      });
    }

    let viewsString;
    if (video.viewsCount) {
      let viewsCount = parseInt(video.viewsCount, 10);
      if (viewsCount >= 1000000) {
        viewsString = (viewsCount / 1000000).toFixed(0) + 'M';
      } else if (viewsCount >= 1000) {
        viewsString = (viewsCount / 1000).toFixed(0) + 'K';
      } else {
        viewsString = viewsCount;
      }
    }

    let diffTime = moment().diff(moment(publishDate), 'seconds');
    let diffString = strings.singularSecond;
    if (diffTime > 3600 * 24) {
      diffString = strings.singularDay;
      diffTime = (diffTime / (3600 * 24)).toFixed(0);
    } else if (diffTime > 3600) {
      diffString = strings.singularHour;
      diffTime = (diffTime / 3600).toFixed(0);
    } else if (diffTime > 60) {
      diffString = strings.singularMinute;
      diffTime = (diffTime / 60).toFixed(0);
    }
    return (
      <View style={styles.container}>
        {this.props.uid === publisher.uid ? (
          <View style={styles.userIdBar} />
        ) : null}
        <View style={styles.videoThumbnail}>
          <Image
            style={styles.videoPreview}
            source={{uri: video.snippet.thumbnails.medium.url}}></Image>
          <TouchableOpacity
            onPress={this._handlePreview}
            style={styles.absoluteIcon}>
            <MdIcon size={30} color="#ffffffe0" name="play-circle-filled" />
          </TouchableOpacity>
          <View style={styles.menuContainer}>
            <Menu onSelect={this._handlePressOption}>
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
                <MenuOption
                  text={strings.watchComments}
                  value="WATCH_COMMENTS"
                />
                {this.props.isAdmin && this.props.isNextVideo ? (
                  <MenuOption text={strings.playNow} value="NEXT" />
                ) : null}
                {this.props.isAdmin &&
                this.props.uid !== publisher.uid &&
                !this.props.isBlocked ? (
                  <MenuOption text={strings.blockUser} value="BLOCK_USER" />
                ) : null}
                {this.props.isAdmin &&
                this.props.uid !== publisher.uid &&
                this.props.isBlocked ? (
                  <MenuOption text={strings.unblockUser} value="UNBLOCK_USER" />
                ) : null}
                {this.props.uid === publisher.uid ? (
                  <MenuOption text={strings.delete} value="DELETE_VIDEO" />
                ) : null}
                {this.props.uid !== publisher.uid ? (
                  <MenuOption text={strings.report} value="REPORT_VIDEO" />
                ) : null}
              </MenuOptions>
            </Menu>
          </View>
        </View>
        <Ripple
          onPress={this._toggleComments}
          style={{
            padding: 10,
            flex: 1,
            flexDirection: 'row',
            paddingRight: 35,
          }}>
          <View style={{flex: 1, justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text numberOfLines={2} style={styles.videoTitle}>
                  {video.snippet.title}
                </Text>
                <Text numberOfLines={1} style={styles.videoInfo}>
                  {video.snippet.channelTitle}
                  {viewsString ? `  - ${viewsString}` : ''}
                  {`  - ${commentsCount || '0'} ${
                    commentsCount === 1
                      ? strings.singularComment
                      : strings.comments
                  }`}
                </Text>
              </View>
            </View>
            <View style={styles.publisherCont}>
              {/* <Image
                                style={styles.publisherImage}
                                source={{ uri: publisher.avatar }}
                            /> */}
              <View style={{paddingLeft: 0}}>
                <Text style={styles.accentText}>{strings.publishedBy}:</Text>
                <View
                  style={[styles.row, {overflow: 'hidden', paddingRight: 10}]}>
                  <Text
                    numberOfLines={1}
                    style={[styles.accentText, {minWidth: 0}]}>
                    <Text
                      style={[
                        styles.accentText,
                        {
                          fontFamily: config.fontBold,
                          color:
                            this.props.uid === publisher.uid
                              ? config.accentColor
                              : config.primaryTextColor,
                        },
                      ]}>
                      {publisher.name}
                    </Text>
                    {'  '}-{' '}
                    {strings.formatString(
                      strings.publishTime,
                      diffTime,
                      diffTime === '1' ? diffString : diffString + 's',
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Ripple>
        <View style={styles.actionsCont}>
          <TouchableOpacity
            onPress={this.handlePressLike}
            style={{alignItems: 'center', minWidth: 32, paddingTop: 20}}>
            <Icon
              size={22}
              style={{marginBottom: 0}}
              color={
                usersWhoLike && usersWhoLike[this.props.uid]
                  ? config.accentColor
                  : config.primaryDarkTextColor
              }
              name="thumbs-up"
            />
          </TouchableOpacity>
          <Text style={[styles.reactionsDiff]}>
            {likes - dislikes > 0 ? '+' : ''}
            {likes - dislikes}
          </Text>
          <TouchableOpacity
            onPress={this.handlePressDislike}
            style={{alignItems: 'center', minWidth: 32, paddingBottom: 15}}>
            <Icon
              size={22}
              style={{marginBottom: 0}}
              color={
                usersWhoLike && usersWhoLike[this.props.uid] === false
                  ? '#ea4335'
                  : config.primaryDarkTextColor
              }
              name="thumbs-down"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: config.primaryDarkColor,
    flexDirection: 'row',
    height: 110,
    marginBottom: 0,
    elevation: 5,
    marginBottom: 8,
    shadowOffset: {width: 2, height: 4},
    shadowColor: 'black',
    shadowOpacity: 1.0,
  },
  absoluteIcon: {
    top: 39,
    left: 33,
    position: 'absolute',
  },
  publisherCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  publisherImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  accentText: {
    fontFamily: config.fontRegular,
    fontSize: 10,
    color: config.primaryDarkTextColor,
  },
  reactionsDiff: {
    fontFamily: config.fontRegular,
    fontSize: 12,
    color: config.primaryTextColor,
    marginTop: 5,
  },
  infoText: {
    fontFamily: config.fontRegular,
    fontSize: 8,
    color: config.primaryDarkTextColor,
  },
  videoPreview: {
    backgroundColor: '#000',
    height: 110,
    width: 100,
    resizeMode: 'contain',
  },
  videoTitle: {
    fontSize: 12,
    fontFamily: config.fontRegular,
    color: config.primaryTextColor,
  },
  videoInfo: {
    fontSize: 8,
    fontFamily: config.fontRegular,
    color: config.primaryDarkTextColor,
  },
  actionsCont: {
    paddingLeft: 10,
    paddingRight: 5,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  menu: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    elevation: 8,
    paddingLeft: 10,
    margin: 5,
    marginTop: Platform.OS === 'ios' ? -70 : -50,
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  optionText: {
    color: '#404040',
    margin: 5,
    fontFamily: config.fontRegular,
  },
  userIdBar: {
    height: 110,
    width: 3,
    backgroundColor: config.primaryTextColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
