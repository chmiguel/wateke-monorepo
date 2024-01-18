import React, { Component } from 'react'
import { Text, View,ScrollView, StyleSheet, Image, TouchableHighlight, Dimensions, TextInput, Keyboard, BackHandler} from 'react-native'
import Ripple from 'react-native-material-ripple'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as Animatable from 'react-native-animatable'
import * as config from '../constants/config'
const window = Dimensions.get('window')
export default class CommentsList extends Component {
    constructor(props){
        super(props)
        this.state={
            visible: false,
            commentsArr: []
        }
    }
    _handleHide=()=>{
        if(this.props.onHide)
        this.props.onHide()
        this.backListener.remove()
    }
    _handleSendComment=()=>{
        if(this.props.onSendComment&&this.state.commentText){
            this.props.onSendComment(this.state.commentText)
            this.setState({commentText: ''})
            Keyboard.dismiss()
            
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.comments===null&&this.props.comments!==null&&this.mainCont){
            this.mainCont.fadeOut(400).then(()=>{
                this.setState({visible: false})
                if(this.props.onHide)
                this.props.onHide()
            })
            this.slider.slideOutDown(300).then(()=>{

            }) 
        }
        if(nextProps.comments){
            let commentsArr = []
            commentsArr = Object.values(nextProps.comments).sort((a,b)=>{
                return a.publishedAt - b.publishedAt 
            })
            this.setState({commentsArr})
            if(commentsArr.length>this.state.commentsArr.length){
                setTimeout(()=>{
                    if(this.scrollView)
                        this.scrollView.scrollToEnd({animated: false})
                }, 600)
            }
        }
        if(nextProps.visible===true&&this.props.visible===false){
            this.setState({visible: true})
            this.backListener = BackHandler.addEventListener('hardwareBackPress', ()=>{
                this._handleHide()
                return true
            })
        }else if(nextProps.visible===false&&this.props.visible===true&&this.mainCont){
            this.mainCont.fadeOut(400).then(()=>{
                this.setState({visible: false})
                if(this.props.onHide)
                this.props.onHide()
            })
            this.slider.slideOutDown(300).then(()=>{

            })
        }
    }
    render() {
        let commentsArr = []
        if(this.props.comments){
			
			commentsArr = Object.values(this.props.comments).sort((a,b)=>{
				return a.publishedAt - b.publishedAt 
			})
        }

        if(this.state.visible)
        return (
            <Animatable.View
            ref={ref=>this.mainCont = ref}
            style={styles.mainCont}
            duration={300}
            animation='fadeIn'>
                <TouchableHighlight
                underlayColor='transparent'
                onPress={this._handleHide}>
                    <View style={styles.cont}>
                        
                    </View>
                </TouchableHighlight>
                <Animatable.View
                ref={ref=>this.slider=ref}
                animation='slideInUp'
                duration={400}
                style={styles.content}
                >
                    <View style={{flex: 1}}>
                        <View style={{padding: 10}}>
                            <Text style={styles.count}>
                                Comentarios ({commentsArr? commentsArr.length: 0})
                            </Text>
                        </View>
                        <View style={styles.divider}></View>
                        <ScrollView
                        ref={comp => this.scrollView = comp}
                        contentContainerStyle={styles.container}>
                            {
                                Array.isArray(commentsArr)?
                                commentsArr.map((item, i)=>{
                                    const {publishedAt} = item
                                    let diffTime = moment().diff(moment(publishedAt), 'seconds')
                                    let diffString = 'segundo'
                                    if(diffTime>(3600*24)){
                                        diffString = 'dia'
                                        diffTime = (diffTime/(3600*24)).toFixed(0)
                                    } else if(diffTime>3600){
                                        diffString = 'hora'
                                        diffTime = (diffTime/3600).toFixed(0)
                                    } else if(diffTime> 60){
                                        diffString = 'minuto'
                                        diffTime = (diffTime/60).toFixed(0)
                                    }
                                    return(
                                        <View 
                                        key={'cm_'+i}
                                        style={styles.commentItem}>
                                            <Image 
                                            style={styles.publisherImage}
                                            source={{uri: item.avatar}}/>
                                            <View style={{flex: 1, paddingLeft: 10}}>
                                                <View 
                                                    style={{
                                                        flexDirection: 'row', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'space-between',
                                                        marginBottom: 5
                                                    }}
                                                >
                                                    <Text 
                                                        numberOfLines={1}
                                                        style={[styles.accentText, {paddingRight: 10}]}
                                                    >
                                                        {item.name}
                                                    </Text>
                                                    <Text style={styles.infoText}>Hace {diffTime} {diffTime==='1'? diffString : diffString+'s'}</Text>
                                                </View>
                                                <Text style={[styles.infoText, {fontSize: 12}]}>
                                                    <Text style={{color: '#808080'}}>Comentó:</Text> {item.comment}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                }) : null
                            }
                        </ScrollView>
                        <View style={styles.inputCont}>
                            <TextInput 
                            onChangeText={text=>this.setState({commentText: text})}
                            value={this.state.commentText}
                            underlineColorAndroid='transparent'
                            placeholder={'Comentar'}
                            style={styles.input}/>
                            <Ripple
                            onPress={this._handleSendComment}
                            style={{
                                width: 40,
                                height: 40,
                                marginLeft: 5,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon 
                                color='#019afd'
                                size={26}
                                name={'send'}/>
                            </Ripple>
                        </View>
                    </View>
                </Animatable.View>
            </Animatable.View>
        )
        else
        return null
    }
}

const styles = StyleSheet.create({
    mainCont:{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
    },
	cont:{
		height: window.height-20,
		backgroundColor: '#00000070',
    },
    content:{
        position: 'absolute',
        height: window.height-180,
        left: 0,
        bottom: 0,
        width: window.width,
        backgroundColor: 'white',
        elevation: 20,
        zIndex: 10001
    },
    container:{
        padding: 10,
        paddingBottom: 60
    },
    publisherImage:{
		width: 40,
		height: 40,
		borderRadius: 20
	},
	accentText:{
		fontFamily: config.fontBold,
		fontSize: 12,
		color: '#808080'
	},
	infoText:{
		fontFamily: config.fontRegular,
		fontSize: 10,
		color: '#404040'
    },
    commentItem:{
        flexDirection: 'row',
        padding: 10,
        marginBottom: 5,
        backgroundColor: '#e9e9e9',
        borderRadius: 4 
    },
    commentsCont:{
    },
    divider:{
        height: 1,
        backgroundColor: '#e9e9e9'
    },
    inputCont:{
        height: 60,
        position: 'absolute',
        bottom: 0,
        borderTopWidth: 1,
        borderColor: '#e0e0e0',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        paddingLeft: 20,
        paddingRight: 10,
        width: window.width,
        backgroundColor: 'white'
    },
    input:{
        flex: 1,
        height: 35,
        paddingLeft: 10,
        borderRadius: 17,
        backgroundColor: '#eaeaea',
        paddingTop: 0,
        paddingBottom: 0
    },
    count:{
        color: '#a0a0a0',
        fontFamily: config.fontRegular,
        textAlign: 'right',
        marginRight: 10
    }
})
