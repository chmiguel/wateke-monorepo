import React, {Component} from 'react'
import {Image, Text, View, TouchableOpacity, ImageBackground, StyleSheet} from 'react-native'
import * as Animatable from 'react-native-animatable';
import Tooltip from 'react-native-walkthrough-tooltip'
import MdIcon from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as config from '../constants/config'


export default class HistoryItem extends Component {
	constructor(props){
		super(props)
		this.state = {
            showLikes: false,
		}
    }
    _toggleComments=()=>{
        if(this.props.item){
            this.props.onPressWatchComments(this.props.listCommentIndex, this.props.item.id)
        }
    }
	_handlePressLike=()=>{
		if(!this.props.item.usersWhoLike[this.props.uid]){
			if(this.props.onPressReact){
				this.props.onPressReact(this.props.item, true)
			}
		}
	}
	_handlePressDislike=()=>{
		if(!(this.props.item.usersWhoLike[this.props.uid]===false)){
			if(this.props.onPressReact){
				this.props.onPressReact(this.props.item, false)
			}
		}
	}
	_handlePlay=()=>{
		if(this.props.canJumpPlay){
			this.props.onPressPlay(this.props.item)
		}
	}
  	render() {
		let {publisher, video, usersWhoLike, usersWhoReact, comments} = this.props.item
		let likes = 0
		let dislikes = 0
		let usersWhoReactLike = []
		let usersWhoReactDislike = []
		if(usersWhoReact){
			Object.keys(usersWhoReact).forEach((item, i)=>{
				if(usersWhoReact[item].reaction===true){
					likes = likes + 1
					usersWhoReactLike.push(' '+usersWhoReact[item].name)
				}else{
					dislikes = dislikes + 1
					usersWhoReactDislike.push(' '+usersWhoReact[item].name)
				}
			})
		}
		let likesString = usersWhoReactLike.length? 'A '+(usersWhoReactLike.toString())+(usersWhoReactLike.length>1? ' les': ' le')+' gusta esto ': 'Nadie ha a reaccionado'
		let dislikesString = usersWhoReactDislike.length? 'A '+usersWhoReactDislike.toString()+(usersWhoReactDislike.length>1? ' no les': ' no le')+' gusta esto': 'Nadie ha reaccionado'
    	return (
      		<View style={styles.historyItem}>
				<View style={{flexDirection: 'row', padding: 10}}>
					<Image
					  style={styles.publisherImage}
					  source={{uri: publisher.avatar}}
					/>
					<View style={{flex: 1, paddingLeft: 10}}>
						<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
							<View style={{}}>
								<Text style={styles.accentText}>
								  {publisher.name}
								</Text>
								<Text style={styles.infoText}>
								  Ha postulado el video:
								</Text>
							</View>
							<View style={{flexDirection: 'row'}}>
								<TouchableOpacity
								onPress={this._handlePressLike}
								style={{flexDirection: 'row', alignItems: 'center', paddingRight: 15}}>
									<Icon 
									size={18}
									style={{marginRight: 3, marginTop: 3}}
									color={usersWhoLike[this.props.uid]? '#019afd' :'#808080'}
									name='thumbs-up'/>
									<Text style={styles.accentText}>
									  {likes}
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
								onPress={this._handlePressDislike}
								style={{flexDirection: 'row', alignItems: 'center', paddingRight: 5}}>
									<Icon 
									size={18}
									style={{marginRight: 3, marginTop: 5}}
									color={usersWhoLike[this.props.uid]===false? '#019afd' :'#808080'}
									name='thumbs-down'/>
									<Text style={styles.accentText}>
									  {dislikes}
									</Text>
								</TouchableOpacity>
							</View>
						</View>
						<TouchableOpacity 
						onPress={this._handlePlay}
						style={styles.videoItem}>
							<ImageBackground
						  	style={styles.videoPreview}
						 	source={{uri: video.snippet.thumbnails.default.url}}
							>
								{
									this.props.canJumpPlay?
									<MdIcon 
									size={32}
									color={'#ffffffe0'}
									name='play-arrow'/> : null
								}
							</ImageBackground>
							<View style={{flex: 1,paddingLeft: 10}}>
								<Text 
								numberOfLines={2}
								style={styles.videoTitle}>
							  		{video.snippet.title}
								</Text>
								<Text 
								numberOfLines={1}
								style={styles.videoInfo}>
							  		{video.snippet.channelTitle}
								</Text>
							</View>
	    				</TouchableOpacity>
					</View>
				</View>
				<View style={styles.reactionsContainer}>
					<View
					style={[styles.reactions]}>
						<Tooltip
						animated
						isVisible={this.state.showLikes}
						content={<Text style={[styles.tooltipText,{marginLeft: 20, marginRight: 20}]}>{likesString}</Text>}
						placement='auto'
						onClose={() => this.setState({ showLikes: false })}
						>
						<TouchableOpacity 
						onPress={()=>this.setState({showLikes: true})}
						style={{flexDirection: 'row', alignItems: 'center'}}>
							<Icon 
							size={18}
							style={{marginRight: 3}}
							color={'#808080'}
							name='thumbs-up'/>
							<Text style={styles.accentText}>
								{likes}
							</Text>
						</TouchableOpacity>
						</Tooltip>
					</View>
					<View
					style={[styles.reactions,{
						borderRightWidth: 1,
						borderLeftWidth: 1,
						borderColor: '#e0e0e0'
					}]}>
						<Tooltip
						animated
						isVisible={this.state.showDislikes}
						content={<Text style={[styles.tooltipText,{marginLeft: 20, marginRight: 20}]}>{dislikesString}</Text>}
						placement='auto'
						onClose={() => this.setState({ showDislikes: false })}
						>
						<TouchableOpacity 
						onPress={()=>this.setState({showDislikes: true})}
						style={{flexDirection: 'row', alignItems: 'center'}}>
							<Icon 
							size={18}
							style={{marginRight: 3, marginTop: 0}}
							color={'#808080'}
							name='thumbs-down'/>
							<Text style={styles.accentText}>
								{dislikes}
							</Text>
						</TouchableOpacity>
						</Tooltip>
					</View>
                    <TouchableOpacity
                    onPress={this._toggleComments} 
                    style={styles.reactions}>
						<Icon 
						size={18}
						style={{marginRight: 3, marginTop: 0}}
						color={'#808080'}
						name='comments'/>
						<Text style={styles.accentText}>
							{comments? Object.keys(comments).length: 0}
						</Text>
					</TouchableOpacity>
				</View>
                <View style={styles.divider}></View>
      		</View>
    	);
  	}
}

const styles = StyleSheet.create({
	container:{
		flex: 1
	},
	historyItem:{
		marginVertical: 5,
		backgroundColor: 'white'
	},
	publisherImage:{
		width: 40,
		height: 40,
		borderRadius: 20
	},
	accentText:{
		fontFamily: config.fontRegular,
		fontSize: 12,
		color: '#404040',
		marginTop: 5
	},
	infoText:{
		fontFamily: config.fontRegular,
		fontSize: 10,
		color: '#808080'
	},
	videoItem:{
		backgroundColor: 'white',
		marginTop: 15,
		flexDirection: 'row'
	},
	videoPreview:{
		backgroundColor: '#000',
		height: 45,
		width: 60,
		justifyContent: 'center',
		alignItems: 'center'
	},
	videoTitle:{
		fontSize: 10,
		fontFamily: config.fontRegular,
		color: '#303030'
	},
	videoInfo:{
		fontSize: 8,
		fontFamily: config.fontRegular
	},
	reactionsContainer:{
		flexDirection: 'row',
		height: 35,
		borderTopWidth: 1,
		borderColor: '#e0e0e0'
	},
	reactions: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		paddingBottom: 5
	},
	tooltipText:{
		fontSize: 12,
		fontFamily: config.fontRegular
	},
	noVideo: {
		height: 200,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'black'
	},
	noVideoText:{
		fontFamily: config.fontRegular,
		fontSize: 12,
		color: 'white',
		textAlign: 'center'
    },
    commentItem:{
        flexDirection: 'row',
        padding: 10
    },
    commentsCont:{
        paddingTop: 10,
        paddingBottom: 10
    },
    divider:{
        height: 1,
        backgroundColor: '#e0e0e0'
    }
});