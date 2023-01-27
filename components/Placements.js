import React from 'react';
import {StyleSheet, View, Button} from 'react-native';
import RNTapResearch from 'react-native-tapresearch';
import {
  tapResearchEmitter,
  PLACEMENT_CODE_SDK_NOT_READY,
} from 'react-native-tapresearch';
import {API_TOKEN, USER_IDENTIFIER} from '../App';
import Toast from 'react-native-toast-message';

class Placements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placements: [],
    };
  }

  componentDidMount() {
    console.log(
      `Setting up callbacks. API token ${API_TOKEN}, unique user ${USER_IDENTIFIER}`,
    );
    this.tapResearchOnPlacementUnavailable = tapResearchEmitter.addListener(
      'tapResearchOnPlacementUnavailable',
      placement => {
        this.onPlacementUnavailable(placement);
      },
    );
    this.setState({buttonPressed: false});

    this.tapResearchOnReceivedRewardCollection = tapResearchEmitter.addListener(
      'tapResearchOnReceivedRewardCollection',
      rewards => {
        console.log('tapResearchOnReceivedRewardCollection', rewards);
        this.onReceiveRewardCollection(rewards);
      },
    );

    this.tapResearchOnReceivedReward = tapResearchEmitter.addListener(
      'tapResearchOnReceivedReward',
      reward => {
        console.log('tapResearchOnReceivedReward', reward);
        this.onReceiveReward(reward);
      },
    );

    this.tapResearchOnSurveyWallOpened = tapResearchEmitter.addListener(
      'tapResearchOnSurveyWallOpened',
      placement => {
        console.log('tapResearchOnSurveyWallOpened');
        this.onSurveyWallOpened(placement);
      },
    );

    this.tapResearchOnSurveyWallDismissed = tapResearchEmitter.addListener(
      'tapResearchOnSurveyWallDismissed',
      () => {
        console.log('Survey Wall Closed');
        // Should make a call to fetch placements again
        this.onSurveyWallClosed();
      },
    );

    this.tapResearchOnEventOpened = tapResearchEmitter.addListener(
      'tapResearchOnEventOpened',
      event => {
        console.log('tapResearchOnEventOpened', event);
        this.onEventOpened(event);
      },
    );

    this.tapResearchOnPlacementReady = tapResearchEmitter.addListener(
      'tapResearchOnPlacementReady',
      placement => {
        console.log('TR Placement Event Ready');
        this.onPlacementReady(placement);
      },
    );
    // End listeners
    console.log('Done with callback setup');

    console.log('Initializing TapResearch');
    RNTapResearch.initWithApiToken(API_TOKEN);
    RNTapResearch.setUniqueUserIdentifier(USER_IDENTIFIER);
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
          this.state.placements.map(placement => (
            <View
              style={styles.container}
              key={placement.placementIdentifier + 'a'}>
              <Button
                key={placement.placementIdentifier}
                onPress={() => this.onSurveyButtonPressed(placement)}
                title={`Show ${
                  placement.isEventAvailable ? 'Event' : 'Survey Wall'
                } for "${placement.currencyName}"
                ${placement.placementIdentifier}`}
                color={placement.isEventAvailable ? 'green' : 'blue'}
              />
            </View>
          ))}
      </View>
    );
  }

  componentWillUnmount() {
    console.log('unmounting');
  }

  onPlacementReady = placement => {
    console.log('onPlacementReady: ', placement);
    console.log('Ready?: ', placement.isSurveyWallAvailable);
    console.log('hasHotSurvey?: ', placement.hasHotSurvey);
    console.log('isEventAvailable?: ', placement.isEventAvailable);
    // Check to make sure we don't already have the placement in state. There is probably a better way to do this.
    if (
      placement.placementCode !== PLACEMENT_CODE_SDK_NOT_READY &&
      !this.state.placements
        .map(p => {
          return p.placementIdentifier;
        })
        .includes(placement.placementIdentifier)
    ) {
      this.setState({placements: [...this.state.placements, placement]});
    } else {
      if (placement.placementCode === PLACEMENT_CODE_SDK_NOT_READY) {
        console.log('The SDK is not ready');
      } else {
        console.log('Placement already exists');
      }
    }
  };

  onPlacementUnavailable = placement => {
    console.log('placement unavailable: ' + placement.placementId);
  };

  onSurveyButtonPressed = placement => {
    if (typeof placement !== 'undefined' && placement.isSurveyWallAvailable) {
      console.log('Showing the survey wall');
      console.log(`Is a hot survey = ${placement.hasHotSurvey}`);
      if (placement.isEventAvailable) {
        RNTapResearch.displayEvent(placement);
        // Alternatively, with passing params
        // RNTapResearch.displayEventWithParams(placement, { 'foos': 'buzz', 'fizz': 'boos' })
      } else {
        RNTapResearch.showSurveyWallWithParams(placement, {
          foos: 'buzz',
          fizz: 'boos',
        });
        // Alternatively, with passing without params
        // RNTapResearch.showSurveyWall(placement);
      }
    } else {
      console.log("The survey wall isn't available", placement);
    }
  };

  onSurveyWallOpened = placement => {
    console.log('onSurveyWallOpened with placement: ', placement);
  };

  onSurveyWallClosed = () => {
    console.log('onSurveyWallClosed');
  };

  onEventOpened = placement => {
    console.log('onEventOpened with placement: ', placement);
  };

  onEventDismissed = () => {
    Toast.show({
      type: 'info',
      text1: 'Event Dismissed',
      position: 'bottom',
      autoHide: false,
      onPress: () => Toast.hide(),
    });
    console.log('onEventDismissed');
  };

  onReceiveReward = reward => {
    console.log(reward);
  };

  onReceiveRewardCollection = rewards => {
    console.log('rewards: ', rewards);
    const sum = rewards.reduce(
      (partialSum, reward) => partialSum + reward.rewardAmount,
      0,
    );
    this.showToast(
      `Rewards ${sum} of ${rewards[rewards.length - 1].currencyName}`,
    );
  };

  showToast = text => {
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
