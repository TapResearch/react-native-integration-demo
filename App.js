import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Placements from './components/Placements';
import Toast from 'react-native-toast-message';
import {LogBox} from 'react-native';

// Ignore log notification warnings for the native emitter:
LogBox.ignoreAllLogs(true);

// currently set to server to server
export const API_TOKEN = '3b2e8639e3db714f98e1078822de673a';
export const UNIQUE_USER_IDENTIFIER = 'test-user-from-github';

// eslint-disable-next-line no-undef
export default App = () => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.description}>
          Press the button below to take a survey!
        </Text>
        <View style={styles.flowRight}>
          <Placements />
        </View>
      </View>
      <Toast position="bottom" bottomOffset={80} />
    </>
  );
};

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    marginTop: 40,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565',
  },
  container: {
    paddingVertical: 0,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 15,
    paddingBottom: 12,
    alignItems: 'center',
  },
  flowRight: {
    paddingVertical: 0,
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
});
