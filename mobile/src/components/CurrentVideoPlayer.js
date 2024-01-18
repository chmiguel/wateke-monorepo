import React, { PureComponent } from 'react'
import { 
    Text, 
    View, 
    StyleSheet, 
    ImageBackground, 
    Dimensions, 
    TouchableOpacity, 
    Image 
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as config from '../constants/config'
import strings from '../constants/translations'

const window = Dimensions.get('window')

export default class CurrentVideoPlayer extends PureComponent {
    render() {
        let { video, publisher } = this.props.video
        let { snippet } = video
        return (
            <View style={[styles.container, this.props.containerStyle]}>
                <View style={{backgroundColor: 'black'}}>
                    <Image
                        source={{ uri: snippet.thumbnails.medium.url }}
                        style={[styles.videoThumbnail, this.props.thumbnailStyle]}/>
                    <View style={styles.absoluteContainer}>
                        {
                            !this.props.noPlay ?
                                <TouchableOpacity
                                    onPress={this.props.onPressPlay}>
                                    <Icon
                                        size={45}
                                        color='#ffffffb0'
                                        name='play-circle-filled' />
                                </TouchableOpacity>
                                : null
                        }
                    </View>
                </View>
                <View
                    style={styles.descriptionCont}>
                    <View
                        style={styles.publisherCont}>
                        <Image
                            source={{ uri: publisher.avatar }}
                            style={styles.avatar} />
                        <View>
                            <Text style={styles.publisherName}>{publisher.name}</Text>
                            <Text style={styles.publishInfo}>{strings.reproducing}:</Text>
                        </View>
                    </View>
                    <View
                        style={styles.videoDesc}>
                        <Text
                            numberOfLines={1}
                            style={styles.videoTitle}>{video.snippet.title}</Text>
                        <Text
                            numberOfLines={1}
                            style={styles.videoChannel}>{video.snippet.channelTitle}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 10,
        backgroundColor: config.primaryDarkColor,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        backgroundColor: '#000000b0'
    },
    videoThumbnail: {
        width: 120,
        height: 90,
        margin: 5,
        marginRight: 0,
        resizeMode: 'contain'
    },
    absoluteContainer:{
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
        marginBottom: 15
    },
    descriptionCont: {
        flex: 1,
        padding: 10,
        height: 100
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 5
    },
    publisherName: {
        color: config.primaryTextColor,
        fontSize: 12,
        fontFamily: config.fontRegular
    },
    publishInfo: {
        color: config.primaryDarkTextColor,
        fontSize: 10,
        fontFamily: config.fontRegular
    },
    videoTitle: {
        color: config.primaryTextColor,
        fontSize: 12,
        fontFamily: config.fontRegular
    },
    videoChannel: {
        color: config.primaryDarkTextColor,
        fontSize: 10,
        fontFamily: config.fontRegular,
        marginTop: -2
    }
})
