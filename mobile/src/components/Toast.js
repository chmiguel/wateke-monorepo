'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Dimensions
} from 'react-native';
import * as config from '../constants/config'
import * as Animatable from 'react-native-animatable'
const window= Dimensions.get('window')
class Toast extends Component {
	show=()=>{
		this.toast.slideInUp(300).then(()=>{
			this.timeout = setTimeout(()=>{
				this.toast.slideOutDown(300).then(()=>{

				})
			}, 5000)
		})
	}
	componentWillUnmount(){
		if(this.timeout){
			clearTimeout(this.timeout)
		}
	}
  	render() {
    	return (
    		<Animatable.View
    		style={styles.container}
    		ref={(comp)=>this.toast = comp}>
				<Text style={styles.text}>
			  	Se ha postulado el video
				</Text>
      		</Animatable.View>	
    	);
  	}
}

const styles = StyleSheet.create({

	container:{
		display: 'none',
		backgroundColor: '#ffffff',
		borderRadius: 6,
		padding: 10,
		minHeight: 40,
		alignItems: 'center',
		position: 'absolute',
		bottom: 30,
		width: window.width*0.8,
		marginLeft: 30,
		left: window.width*0.1,
		elevation: 1
	},
	text:{
		fontFamily: config.fontRegular,
		fontSize: 12,
		textAlign: 'center'
	}
});


export default Toast;