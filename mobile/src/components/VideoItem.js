import React from 'react'
import {
	View,
	StyleSheet,
	Text,
	ImageBackground,
	TouchableOpacity,
} from 'react-native'
import moment from 'moment'
import * as config from '../constants/config'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as Animatable from 'react-native-animatable'
import strings from '../constants/translations'

export default class VideoItem extends React.PureComponent {

	_handlePost = () => {
		if (this.props.onPressPost) {
			this.props.onPressPost(this.props.item)
		}
	}

	_handlePreviewVideo = () => {
		this.props.onPressPreview(this.props.item)
	}

	render() {
		let { snippet, statistics } = this.props.item
		let diffTime = moment().diff(moment(snippet.publishedAt), 'hours')
		let diffString = strings.singularHour
		if (diffTime > 8064) {
			diffString = strings.singularYear
			diffTime = (diffTime / 8064).toFixed(0)
		} else if (diffTime > 672) {
			diffString = strings.singularWeek
			diffTime = (diffTime / 672).toFixed(0)
		} else if (diffTime > 24) {
			diffString = strings.singularHour
			diffTime = (diffTime / 24).toFixed(0)
		}
		let viewsCount = parseInt(statistics.viewCount, 10)
		let viewsString
		if (viewsCount >= 1000000) {
			viewsString = (viewsCount / 1000000).toFixed(0) + 'M'
		} else if (viewsCount >= 1000) {
			viewsString = (viewsCount / 1000).toFixed(0) + 'K'
		} else {
			viewsString = viewsCount
		}
		return (
			<View style={styles.videoItem}>
				<TouchableOpacity
					onPress={this._handlePreviewVideo}>
					<ImageBackground
						style={styles.videoPreview}
						source={{ uri: snippet.thumbnails.medium.url }}
					>
						<Icon
							size={40}
							color='#fffffff0'
							name='play-arrow' />
						<View style={styles.durationCont}>
							<Text style={styles.duration}>
								{statistics.durationString}
							</Text>
						</View>
					</ImageBackground>
				</TouchableOpacity>
				<View style={{ flex: 1, paddingLeft: 10 }}>
					<Text
						numberOfLines={2}
						style={styles.videoTitle}>
						{snippet.title}
					</Text>
					<Text style={styles.videoInfo}>
						{snippet.channelTitle} · {viewsString}
					</Text>
					<Text style={styles.videoInfo}>
					{strings.formatString(strings.publishTime, diffTime, diffTime === '1' ? diffString : diffString + 's')}
					</Text>
					{
						this.props.isPublished ?
							<Animatable.View
								animation={'bounceIn'}
								duration={300}
								style={styles.postedSuccess}>
								<Icon
									style={{ marginRight: 5 }}
									name='done'
									size={18}
									color='#fff' />
								<Text style={styles.postedSuccessText}>
									{strings.singularPosted}
								</Text>
							</Animatable.View>
							:
							<TouchableOpacity
								onPress={this._handlePost}
								style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'flex-start' }]}>
								<Icon
									style={{ marginRight: 3 }}
									size={26}
									color={config.accentColor}
									name='playlist-add' />
								<Text style={[styles.videoInfo, { fontSize: 12 }]}>
									{strings.post}
							</Text>
							</TouchableOpacity>
					}

				</View>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	videoItem: {
		padding: 10,
		backgroundColor: config.primaryDarkColor,
		marginVertical: 5,
		flexDirection: 'row',
		elevation: 4,
		marginHorizontal: 10,
		shadowOffset: { width: 2, height: 3, },
		shadowColor: 'black',
		shadowOpacity: 1.0,
	},
	videoPreview: {
		backgroundColor: '#000',
		height: 90,
		width: 120,
		alignItems: 'center',
		justifyContent: 'center'
	},
	videoTitle: {
		fontSize: 12,
		fontFamily: config.fontRegular,
		color: config.primaryTextColor
	},
	videoInfo: {
		fontSize: 10,
		fontFamily: config.fontRegular,
		color: config.primaryDarkTextColor
	},
	suggestions: {
		margin: 10,
		marginBottom: 0,
		fontFamily: config.fontRegular,
		color: config.primaryTextColor,
		fontSize: 12
	},
	durationCont: {
		position: 'absolute',
		right: 3,
		bottom: 3,
		padding: 3,
		backgroundColor: '#000000a0',
		borderRadius: 3
	},
	duration: {
		color: config.primaryTextColor,
		fontSize: 10,
		fontFamily: config.fontBold
	},
	postedSuccess: {
		backgroundColor: 'green',
		padding: 3,
		paddingLeft: 5,
		paddingRight: 5,
		borderRadius: 15,
		marginTop: 10,
		width: 90,
		flexDirection: 'row',
		alignItems: 'center'
	},
	postedSuccessText: {
		color: '#fff',
		fontFamily: config.fontRegular,
		fontSize: 10
	}
})