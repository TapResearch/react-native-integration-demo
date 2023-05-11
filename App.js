import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {LogBox} from 'react-native';
import Config from 'react-native-config';
import Placements from './components/Placements/Placements';
import RNTapResearch from 'react-native-tapresearch';

// Ignore log notification warnings for the native emitter:
LogBox.ignoreAllLogs(true);

// currently set to server to server
// export const TAP_RN_API_TOKEN = process.env.TAP_RN_API_TOKEN;
export const {API_TOKEN, USER_IDENTIFIER} = Config;

// eslint-disable-next-line no-undef
export default App = () => {
  useEffect(() => {
    RNTapResearch.initWithApiToken(API_TOKEN);
    RNTapResearch.setUniqueUserIdentifier(USER_IDENTIFIER);
    RNTapResearch.setReceiveRewardCollection(true);
  }, []);

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
