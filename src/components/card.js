import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

const Card = (props) => {
  const { cardStyle,cardContent } = styles;
  const style = props.style;
  return (
      <View style={[cardStyle,style]}>
        <View style={[cardContent,style]}>{props.children}</View>
      </View>
  );
}

const styles = StyleSheet.create({
  cardStyle: {
    width: (Dimensions.get('window').width/2.20),
    height: 120,
    borderRadius: 25,
    elevation: 10,
    backgroundColor: '#00bcd4',
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#262d3c',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginBottom: 5,
    marginTop:2,
  },
  cardContent: {
    marginLeft:10,
    borderRadius: 25,
    //alignItems: 'center',
    //justifyContent: 'center',
  },
});

export {Card};
