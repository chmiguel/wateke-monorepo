'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View
} from 'react-native';
import * as config from '../constants/config'
import Ripple from 'react-native-material-ripple'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FaIcon from 'react-native-vector-icons/FontAwesome'

const FloatButton = (props)=>{
    return (
      <Ripple
      rippleContainerBorderRadius={25}
      onPress={props.onPress}
      style={[styles.touch, props.buttonStyle]}>
        {
          props.iconType==='font-awesome'?
          <FaIcon 
          size={26}
          color={props.iconColor||'white'}
          name={props.icon}/>
          :
          <Icon 
          size={26}
          color={props.iconColor||'white'}
          name={props.icon}/>

        }
      </Ripple>
    )
}
const styles = StyleSheet.create({
	touch:{
		backgroundColor: config.accentColor,
		width: 56,
		height: 56,
		borderRadius: 28,
		elevation: 4,
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center'
	},
	content:{
		height: 50,
		width: 50
	}
});

export default FloatButton
