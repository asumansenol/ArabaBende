import React from 'react';
import * as firebase from 'firebase';
import { StyleSheet, View, Text } from 'react-native';
import { firebaseConfig } from './config';
import AppNavigator from './navigation/AppNavigator';
import MyProvider from './Provider';

firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {

  render() {
      return (
        <MyProvider>
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </MyProvider>
      );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

