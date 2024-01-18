import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import {Menu, MenuItem} from 'react-native-material-menu';

type Props = {
  onSearch?: () => void;
};

const SearchInput = (props: Props) => {
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar canción"
        placeholderTextColor="#fff"
        onEndEditing={props.onSearch}
        style={styles.input}
        underlineColorAndroid="transparent"
      />
      <Menu
        visible={visible}
        anchor={
          <TouchableOpacity
            onPress={showMenu}
            style={styles.providerSelectorContainer}>
            <MdIcon name="arrow-drop-down" size={26} color="#fff" />
            <Text style={styles.providerText}>Proveedor</Text>
          </TouchableOpacity>
        }
        onRequestClose={hideMenu}>
        <MenuItem onPress={hideMenu}>Youtube</MenuItem>
        <MenuItem onPress={hideMenu}>Spotify</MenuItem>
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
    margin: 20,
    height: 40,
  },
  input: {
    paddingLeft: 10,
    color: '#fff',
    flex: 1,
  },
  providerSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderColor: '#fff',
    paddingLeft: 5,
    paddingRight: 10,
    height: '100%',
  },
  providerText: {
    color: '#fff',
    marginLeft: 1,
  },
});

export default SearchInput;
