import React, {PureComponent} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import DrawerLayout from 'react-native-drawer-layout-polyfill';
// import firebase from 'react-native-firebase'
import Icon from 'react-native-vector-icons/MaterialIcons';
import FaIcon from 'react-native-vector-icons/FontAwesome';
// import { Actions } from 'react-native-router-flux'
// import { connect } from 'react-redux'
import * as config from '../constants/config';
// import { logout, setAccount } from '../ducks/access'
import strings from '../constants/translations';

export default class DrawerMenu extends PureComponent {
  open() {
    this[this.props.refProps].openDrawer();
  }
  close() {
    this[this.props.refProps].closeDrawer();
  }
  render() {
    return (
      <DrawerLayout
        ref={comp => (this[this.props.refProps] = comp)}
        drawerWidth={280}
        //drawerLockMode='locked-closed'
        drawerPosition={DrawerLayout.positions.Left}
        renderNavigationView={() => (
          <ConnectedMenu onCloseDrawer={() => this.close()} />
        )}>
        {this.props.children}
      </DrawerLayout>
    );
  }
}

class Menu extends PureComponent {
  _handleLogout = () => {
    // firebase.database().ref(`usuarios/${this.props.user.uid}/fcmToken`).remove()
    // 	.then(() => {
    // 		firebase.database().goOffline()
    // 		firebase.database().goOnline()
    // 		firebase.auth().signOut()
    // 	})
    this.props.logout();
    Actions.access({type: 'reset'});
  };

  _handleReportSpot = () => {
    this.props.onCloseDrawer();
    Actions.reportModal({
      reportType: 'spot',
      spot: this.props.user.selectedSpot.id,
      userWhoReport: this.props.user.uid,
    });
  };

  _handleSearchSpots = async () => {
    let user = {
      ...this.props.user,
      selectedSpot: null,
    };

    this.props.setAccount(user);

    Actions.selectSpot({type: 'reset'});
    // if(this.props.user.uid===this.props.user.selectedSpot.creator){
    // 	await firebase.database()
    // 	.ref(`spots/${this.props.user.selectedSpot.id}/listenerConnection`)
    // 	.remove()
    // }
    // firebase.database().goOffline()
    // firebase.database().goOnline()
  };

  _handleShare = () => {
    Share.share({
      title: 'Compartir Spot',
      message: `Escuchemos la musica que nos gusta juntos en un Wateke: ${config.APP_URL}/spots/${this.props.user.selectedSpot.id}`,
    });
  };
  render() {
    let {avatar, name, email} = this.props.user;
    return (
      <ScrollView style={styles.drawer}>
        <ImageBackground
          style={styles.header}
          source={
            this.props.user.selectedSpot
              ? {
                  uri:
                    this.props.user.selectedSpot.coverPictureMin ||
                    this.props.user.selectedSpot.coverPicture,
                }
              : require('../images/splash.jpg')
          }>
          <View style={styles.backdark}>
            <View style={{flexDirection: 'row'}}>
              <Image style={styles.avatar} source={{uri: avatar}} />
              <View style={{flex: 1, paddingLeft: 10, paddingTop: 15}}>
                <Text style={styles.username}>{name}</Text>
                <Text style={styles.email}>
                  {strings.currentSpot}:{' '}
                  {this.props.user.selectedSpot
                    ? this.props.user.selectedSpot.name
                    : '--'}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
        <TouchableOpacity onPress={Actions.profile} style={styles.menuItem}>
          <Icon size={26} color="#808080" name="settings" />
          <Text style={styles.light}>{strings.settings}</Text>
        </TouchableOpacity>
        {this.props.user && this.props.user.selectedSpot ? (
          <TouchableOpacity
            onPress={this._handleReportSpot}
            style={styles.menuItem}>
            <Icon size={26} color="#808080" name="report" />
            <Text style={styles.light}>{strings.reportSpot}</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={this._handleSearchSpots}
          style={styles.menuItem}>
          <Icon size={26} color="#808080" name="music-video" />
          <Text style={styles.light}>{strings.searchSpots}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={Actions.manageSpots} style={styles.menuItem}>
          <Icon size={26} color="#808080" name="library-music" />
          <Text style={styles.light}>{strings.mySpots}</Text>
        </TouchableOpacity>
        {this.props.adminUid === this.props.user.uid ? (
          <TouchableOpacity onPress={Actions.spotUsers} style={styles.menuItem}>
            <Icon size={26} color="#808080" name="supervisor-account" />
            <Text style={styles.light}>{strings.manageUsers}</Text>
          </TouchableOpacity>
        ) : null}
        {/* <TouchableOpacity
					onPress={Actions.myPlaylists}
					style={styles.menuItem}>
					<Icon
						size={26}
						color='#808080'
						name='queue-music' />
					<Text style={styles.light}>
						Mis Playlists
          			</Text>
				</TouchableOpacity> */}
        <TouchableOpacity onPress={Actions.scanQr} style={styles.menuItem}>
          <FaIcon size={26} color="#808080" name="qrcode" />
          <Text style={styles.light}>{strings.scanQr}</Text>
        </TouchableOpacity>
        {this.props.user && this.props.user.selectedSpot ? (
          <TouchableOpacity onPress={this._handleShare} style={styles.menuItem}>
            <Icon size={26} color="#808080" name="share" />
            <Text style={styles.light}>{strings.inviteFriend}</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={this._handleLogout} style={styles.menuItem}>
          <Icon size={26} color="#808080" name="exit-to-app" />
          <Text style={styles.light}>{strings.logout}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.accessStore.user,
    adminUid: state.accessStore.user.selectedSpot
      ? state.accessStore.user.selectedSpot.creator
      : null,
  };
}
const ConnectedMenu = connect(mapStateToProps, {logout, setAccount})(Menu);

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: config.primaryDarkColor,
  },
  header: {
    height: 170,
    width: '100%',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  username: {
    color: 'white',
    fontFamily: config.fontBold,
    fontSize: 12,
  },
  email: {
    color: 'white',
    fontFamily: config.fontRegular,
    fontSize: 12,
  },
  backdark: {
    flex: 1,
    backgroundColor: '#00000080',
    padding: 10,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  bold: {
    fontFamily: config.fontBold,
    color: config.primaryTextColor,
    fontSize: 12,
  },
  light: {
    fontFamily: config.fontLight,
    color: config.primaryTextColor,
    fontSize: 12,
    marginLeft: 10,
  },
  regular: {
    fontFamily: config.fontRegular,
    color: config.primaryTextColor,
    fontSize: 12,
  },
  menuItem: {
    minHeight: 50,
    paddingLeft: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    fontFamily: config.fontRegular,
    color: config.primaryDarkTextColor,
    fontSize: 10,
  },
});
