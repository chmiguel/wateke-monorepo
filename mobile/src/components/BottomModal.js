import React, { Component } from 'react'
import { TouchableHighlight, View,  StyleSheet, Dimensions, BackHandler} from 'react-native'
import * as Animatable from 'react-native-animatable'
const window = Dimensions.get('window')

export default class BottomModal extends Component {
    constructor(props){
        super(props)
        this.state = {
            visible: false
        }
    }
    _handleHide=()=>{
        if(this.props.onHide)
        this.props.onHide()
        BackHandler.removeEventListener('hardwareBackPress', this.backListener)
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.visible===true&&this.props.visible===false){
            this.setState({visible: true})
            BackHandler.addEventListener('hardwareBackPress', this.backListener)
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
    backListener = ()=>{
        this._handleHide()
        return true
    }
    render() {
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
                {this.props.children}
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
    }
});