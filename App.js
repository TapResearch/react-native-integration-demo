import React, { useEffect } from 'react';
import RNTapResearch from 'react-native-tapresearch';
import { tapResearchEmitter, PLACEMENT_CODE_SDK_NOT_READY } from 'react-native-tapresearch';

import { StyleSheet, Text, View, Button } from 'react-native';

export default App = () => {
  useEffect(() => {
    RNTapResearch.initWithApiToken(API_TOKEN);
    RNTapResearch.setUniqueUserIdentifier(UNIQUE_USER_IDENTIFIER);
    RNTapResearch.setReceiveRewardCollection(false);

    const tapResearchOnSurveyWallOpened = tapResearchEmitter.addListener(
      'tapResearchOnSurveyWallOpened',
      onSurveyWallOpened
    );

    const tapResearchOnSurveyWallClosed = tapResearchEmitter.addListener(
      'tapResearchOnSurveyWallDismissed',
      onSurveyWallClosed
    );

    const tapResearchOnReceiveReward = tapResearchEmitter.addListener(
      'tapResearchOnReceivedReward',
      onReceiveReward
    );

    const tapResearchOnPlacementReady = tapResearchEmitter.addListener(
      'tapResearchOnPlacementReady',
      onPlacementReady
    );

    const tapResearchOnPlacementEventReady = tapResearchEmitter.addListener(
      'tapResearchOnPlacementEventReady',
      onPlacementEventReady
    );

    const tapResearchOnPlacementUnavailable = tapResearchEmitter.addListener(
      'tapResearchOnPlacementUnavailable',
      onPlacementUnavailable
    );

    const tapResearchOnReceivedRewardCollection = tapResearchEmitter.addListener(
      'tapResearchOnReceivedRewardCollection',
      onReceiveRewardCollection
    );

    return () => {
      tapResearchEmitter.removeSubscription(tapResearchOnSurveyWallClosed);
      tapResearchEmitter.removeSubscription(tapResearchOnSurveyWallOpened);
      tapResearchEmitter.removeSubscription(tapResearchOnReceiveReward);
      tapResearchEmitter.removeSubscription(tapResearchOnPlacementReady);
      tapResearchEmitter.removeSubscription(tapResearchOnPlacementEventReady);
      tapResearchEmitter.removeSubscription(tapResearchOnReceivedRewardCollection);
      tapResearchEmitter.removeSubscription(tapResearchOnPlacementUnavailable);
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Press the button below to take a survey!
      </Text>
      <View style={styles.flowRight}>
        <Button
          style={styles.button}
          onPress={onSurveyButtonPressed}
          color='#48BBEC'
          title='Take Survey'
        />
      </View>
    </View>
  );
}

const onPlacementReady = (placement) => {
  console.log(placement);
  if (placement.placementCode != PLACEMENT_CODE_SDK_NOT_READY) {
    if (placement.isSurveyWallAvailable) {
      this.placement = placement
    } else {
      console.log("Not showing survey wall");
    }
  } else {
    console.log("The SDK is not ready");
  }
}

const onPlacementEventReady = (placement) => {
  console.log("onplacement event ready ")
  console.log(placement);
  if (placement.placementCode != PLACEMENT_CODE_SDK_NOT_READY) {
    if (placement.isSurveyWallAvailable) {
      this.placement = placement
    } else {
      console.log("Not showing survey wall");
    }
  } else {
    console.log("The SDK is not ready");
  }
}


const onPlacementUnavailable = (placementId) => {
  console.log("placement unavailable: " + placementId.placementId)
}

const onSurveyButtonPressed = () => {
  if (typeof this.placement !== 'undefined' && this.placement.isSurveyWallAvailable) {
    console.log("Showing the survey wall");
    console.log(`Is a hot survey = ${this.placement.hasHotSurvey}`);
    RNTapResearch.showSurveyWallParams(this.placement, { "foos": "buzz", "fizz": "boos" });
  } else {
    console.log("The survey wall isn't available");
  }
}

const onSurveyWallOpened = (placement) => {
  console.log("onSurveyWallOpened");
}

const onSurveyWallClosed = (placement) => {
  console.log("onSurveyWallClosed");
}

const onReceiveReward = (reward) => {
  console.log(reward);
}

const onReceiveRewardCollection = (rewards) => {
  console.log(rewards);
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 100,
    alignItems: 'center'
  },
  button: {
    margin: 24,
  },
  flowRight: {
    marginTop: 50,
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
