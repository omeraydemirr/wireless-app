import React from 'react';
import {StyleSheet, View} from 'react-native';

export default function HomeCard(props) {
  return (
    <View style={styles.view}>
      <View style={styles.card}>
        <View style={styles.cardContent}>{props.children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {},
  card: {
    width: 400,
    height: 200,
    borderRadius: 12,
    elevation: 5,
    backgroundColor: '#03a9f4',
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 5,
    marginVertical: 2,
    marginTop: 15,
    alignSelf: 'center',
  },
  cardContent: {
    marginHorizontal: 28,
    marginVertical: 10,
  },
});
