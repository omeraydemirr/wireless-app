import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, TouchableOpacity} from 'react-native';
//import SideIcon from '../assets/icons/sidebar';
//import {MaterialIcons} from "@expo/vector-icons";
import {Icon} from 'react-native-elements';
export default function Header({navigation}) {
  const openMenu = () => {
    navigation.openDrawer();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.icon_view} onPress={openMenu}>
      <View >
      <Icon iconStyle={styles.icon} name="menu"  />
      </View>
      </TouchableOpacity>
      <View style={styles.headerTitle}>

        <Image
          source={require('../assets/wifiapp.png')}
          style={styles.headerImage}
        />
        <Text style={styles.headerText}>Wi-Fi App </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    backgroundColor: '#353f53',
    alignItems:'center',
    justifyContent:'center',
  },
  icon_view:{flexDirection:"row",left:0,position:"absolute"},
  icon: {
    color: '#fff',
  },
  headerTitle: {
    flexDirection: 'row',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 21,
    color: '#fff',
    letterSpacing: 2,
  },
  headerImage: {
    width: 25,
    height: 25,
  },
});
