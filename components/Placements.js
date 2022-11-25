import React from 'react';
import {StyleSheet, View, Button} from 'react-native';
import RNTapResearch from 'react-native-tapresearch';
import {tapResearchEmitter, PLACEMENT_CODE_SDK_NOT_READY} from 'react-native-tapresearch';
import {API_TOKEN, UNIQUE_USER_IDENTIFIER} from '../App';
import LoadingView from 'react-native/Libraries/Utilities/LoadingView';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';


class Placements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placements: [],
    };
  }

  componentDidMount() {
    console.log('Setting up callbacks');
    // Start listeners
    // React Native 0.65+ altered EventEmitter:
    // - removeSubscription is gone
    // - addListener returns an unsubscriber instead of a more complex object with eventType etc. We should update this at some point
    this.tapResearchOnPlacementUnavailable = tapResearchEmitter.addListener(
      'tapResearchOnPlacementUnavailable',
      (placement) => {
        this.onPlacementUnavailable(placement);
      },
    );
    this.setState({ buttonPressed: false });

    this.tapResearchOnReceivedRewardCollection = tapResearchEmitter.addListener(
      'tapResearchOnReceivedRewardCollection',
      (rewards) => {
        console.log('tapResearchOnReceivedRewardCollection', rewards);
        this.onReceiveRewardCollection(rewards);
      },
    );

    this.tapResearchOnReceiveReward = tapResearchEmitter.addListener(
      'tapResearchOnReceivedReward',
      (reward) => {
        console.log('tapResearchOnReceivedReward', reward);
        this.onReceiveReward(reward);
      },
    );

    this.tapResearchOnSurveyWallOpened = tapResearchEmitter.addListener(
      'tapResearchOnSurveyWallOpened',
      (placement) => {
        console.log('tapResearchOnSurveyWallOpened');
        this.onSurveyWallOpened(placement);
      },
    );

    this.tapResearchOnSurveyWallClosed = tapResearchEmitter.addListener(
      'tapResearchOnSurveyWallDismissed',
      () => {
        console.log('Survey Wall Closed');
        // Should make a call to fetch placements again
        this.onSurveyWallClosed();
      },
    );

    this.tapResearchOnPlacementReady = tapResearchEmitter.addListener(
      'tapResearchOnPlacementReady',
      (placement) => {
        console.log('TR Placement Event Ready');
        this.onPlacementReady(placement);
      },
    );
    // End listeners
    console.log('Done with callback setup');

    console.log('Initializing TapResearch');
    RNTapResearch.initWithApiToken(API_TOKEN);
    /*
      Don't actually use this uuid generator in production, this is just for testing so we will always
      be sent to the profiler
     */
    // RNTapResearch.setUniqueUserIdentifier(uuid.v4());
    RNTapResearch.setUniqueUserIdentifier(UNIQUE_USER_IDENTIFIER);
    /*
      Setting to true will use the callback event tapResearchOnReceivedRewardCollection
        You will likely want to use this if you want to handle more than one reward at a time
      Setting to false will use the callback event tapResearchOnReceivedReward
     */
    RNTapResearch.setReceiveRewardCollection(true);
    console.log('Mounted');
  }

  render() {
    return (
      <View key={this.state.placements.length}>
        {this.state.placements.length > 0 &&
          this.state.placements.map((placement) => (
            <View style={styles.container} key={placement.placementIdentifier + 'a'}>
              <Button
                key={placement.placementIdentifier}
                onPress={() => this.onSurveyButtonPressed(placement)}
                title={`Show ${placement.isEventAvailable ? 'Event' : 'Survey Wall'} for "${placement.currencyName}"
                ${placement.placementIdentifier}`}
                color={placement.isEventAvailable ? 'green' : 'blue'}
              />
            </View>
          ))}
      </View>
    );
  };


  componentWillUnmount() {
    console.log('unmounting');
    // Here we remove the listeners
    this.tapResearchOnSurveyWallClosed.remove();
    this.tapResearchOnSurveyWallOpened.remove();
    this.tapResearchOnReceiveReward.remove();
    this.tapResearchOnPlacementReady.remove();
    this.tapResearchOnReceivedRewardCollection.remove();
    this.tapResearchOnPlacementUnavailable.remove();
  }

  onPlacementReady = (placement) => {
    console.log('onPlacementReady: ', placement);
    console.log('Ready?: ', placement.isSurveyWallAvailable);
    console.log('hasHotSurvey?: ', placement.hasHotSurvey);
    // Check to make sure we don't already have the placement in state. There is probably a better way to do this.
    if (placement.placementCode !== PLACEMENT_CODE_SDK_NOT_READY && !this.state.placements.map((p) => {
      return p.placementIdentifier;
    }).includes(placement.placementIdentifier)) {
      this.setState({ placements: [ ...this.state.placements, placement ] });
    } else {
      if (placement.placementCode === PLACEMENT_CODE_SDK_NOT_READY) {
        console.log('The SDK is not ready');
      } else {
        console.log('Placement already exists');
      }

    }
  };

  onPlacementUnavailable = (placement) => {
    console.log('placement unavailable: ' + placement.placementId);
  };

  onSurveyButtonPressed = (placement) => {
    if (typeof placement !== 'undefined' && placement.isSurveyWallAvailable) {
      console.log('Showing the survey wall');
      console.log(`Is a hot survey = ${placement.hasHotSurvey}`);
      if (placement.isEventAvailable) {
        RNTapResearch.displayEvent(placement);
        // Alternatively, with passing params
        // RNTapResearch.displayEventWithParams(placement, { 'foos': 'buzz', 'fizz': 'boos' })
      } else {
        RNTapResearch.showSurveyWallWithParams(placement, { 'foos': 'buzz', 'fizz': 'boos' });
        // Alternatively, with passing without params
        // RNTapResearch.showSurveyWall(placement);
      }
    } else {
      console.log('The survey wall isn\'t available', placement);
    }
  };

  onSurveyWallOpened = (placement) => {
    console.log('onSurveyWallOpened with placement: ', placement);
  };


  onSurveyWallClosed = () => {
    Toast.show({ type: 'info', text1: 'Survey Wall Closed', position: 'bottom', autoHide: false, onPress: () => Toast.hide() });
    console.log('onSurveyWallClosed');
  };


  onReceiveReward = (reward) => {
    console.log(reward);
  };


  onReceiveRewardCollection = (rewards) => {
    console.log('rewards: ', rewards);
    const sum = rewards.reduce((partialSum, reward) => partialSum + reward.rewardAmount, 0);
    this.showToast(`Rewards ${sum} of ${rewards[rewards.length - 1].currencyName}`);
    // LoadingView.showMessage(`Rewards ${sum} of ${rewards[rewards.length - 1].currencyName}`, 'refresh');
  };

  showToast = (text) => {
    Toast.show({
      type: 'success',
      text1: text,
      text2: 'This is some something 👋',
    });
  };

}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    marginTop: 15,
    alignItems: 'center',
  },
  flowRight: {
    marginTop: 50,
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default Placements;
