import React from 'react';
import RNTapResearch from 'react-native-tapresearch';
import { tapResearchEmitter } from 'react-native-tapresearch';

import { StyleSheet, Text, View, Button } from 'react-native';

export default class App extends React.Component {

  render() {
    RNTapResearch.initPlacement(PLACEMENT_IDENTIFIER, (placement) => {
        console.log(placement)
        this.placement = placement
    })
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Press the button below to take a survey!
        </Text>
        <View style={styles.flowRight}>
          <Button
            onPress={this._onSurveyButtonPressed}
            color='#48BBEC'
            title='Take Survey'
          />
        </View>
      </View>
    );
  }

  componentWillMount() {
    RNTapResearch.initWithApiToken(API_TOKEN);
    RNTapResearch.setUniqueUserIdentifier(UNIQUE_USER_IDENTIFIER)

    this.tapResearchOnSurveyWallOpened = tapResearchEmitter.addListener(
        'tapResearchOnSurveyWallOpened',
        this.onSurveyWallOpened
    );

    this.tapResearchOnSurveyWallClosed = tapResearchEmitter.addListener(
        'tapResearchOnSurveyWallDismissed',
        this.onSurveyWallClosed
    );

    this.tapResearchOnReceiveReward = tapResearchEmitter.addListener(
      'tapResearchOnReceivedReward',
      this.onRecieveReward
    )

  }

  _onSurveyButtonPressed = () => {
    if (typeof this.placement !== 'undefined' && this.placement.isSurveyWallAvailable) {
         console.log("showing survey wall")
         console.log(`Is a hot survey = ${this.placement.hasHotSurvey}`)
         RNTapResearch.showSurveyWall(this.placement)
      } else {
        console.log("The survey wall isn't available")
      }
  }

  onSurveyWallOpened = (placement) => {
    console.log("onSurveyWallOpened")
  }

  onSurveyWallClosed = (placement) => {
    console.log("onSurveyWallClosed")
  }

  onRecieveReward = (reward) => {
    console.log(reward)
  }

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
  flowRight: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
