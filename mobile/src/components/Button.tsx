import React from 'react';

import {StyleSheet, Text, TextStyle, ViewStyle} from 'react-native';
import * as config from '../constants/config';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ripple from 'react-native-material-ripple';

interface ButtonProps {
  onPress: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  text: string;
  icon: string;
  iconColor: string;
}

const Button: React.FC<ButtonProps> = props => {
  return (
    <Ripple
      onPress={props.onPress}
      style={[styles.container, props.containerStyle]}>
      {props.icon ? (
        <Icon
          style={{marginRight: 10}}
          size={22}
          color={props.iconColor}
          name={props.icon}
        />
      ) : null}
      <Text numberOfLines={1} style={[styles.text, props.textStyle]}>
        {props.text}
      </Text>
    </Ripple>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 40,
    backgroundColor: '#fff',
    borderRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  text: {
    color: '#505050',
    fontFamily: config.fontLight,
    fontSize: 14,
  },
});

export default Button;
