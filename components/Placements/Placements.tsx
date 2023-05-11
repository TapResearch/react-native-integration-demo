import React, {useEffect, useState} from 'react';
import RNTapResearch from 'react-native-tapresearch';
import {
  tapResearchEmitter,
  PLACEMENT_CODE_SDK_NOT_READY,
} from 'react-native-tapresearch';
import {API_TOKEN, USER_IDENTIFIER} from '../../App';
// import Toast from 'react-native-toast-message';
import {Button, StyleSheet, View} from 'react-native';
import {Placement} from '../../interfaces/placement';
import Toast from 'react-native-toast-message';

export type NewplacementsProps = {};

const showToast = text => {
  Toast.show({
    type: 'success',
    text1: text + '🤑',
    // text2: 'This is some something 👋',
  });
};

const onSurveyWallClosed = () => {
  console.log('onSurveyWallClosed');
};

const onEventOpened = placement => {
  console.log('onEventOpened with placement: ', placement);
};

const onEventDismissed = placement => {
  Toast.show({
    type: 'info',
    text1: 'Event Dismissed',
    position: 'bottom',
    autoHide: false,
    onPress: () => Toast.hide(),
  });
  console.log('onEventDismissed', placement);
};

const createOnPlacementUnavailable = (
  setPlacements: React.Dispatch<React.SetStateAction<Placement>>,
) => {
  return placement => {
    console.log('placement unavailable: ' + placement.placementId);
    setPlacements(placements => [
      ...placements.filter(
        p => p.placementIdentifier !== placement.placementIdentifier,
      ),
      placement,
    ]);
  };
};

const tapResearchOnReceivedRewardCollection = rewards => {
  console.log('rewards: ', rewards);
  const sum = rewards.reduce(
    (partialSum, reward) => partialSum + reward.rewardAmount,
    0,
  );
  showToast(`Rewards ${sum} of ${rewards[rewards.length - 1].currencyName}`);
};

const onSurveyButtonPressed = placement => {
  if (typeof placement !== 'undefined' && placement.isSurveyWallAvailable) {
    console.log('Showing the survey wall');
    console.log(`Is a hot survey = ${placement.hasHotSurvey}`);
    if (placement.isEventAvailable) {
      RNTapResearch.displayEvent(placement);
    } else {
      RNTapResearch.showSurveyWallWithParams(placement, {
        foos: 'buzz',
        fizz: 'boos',
      });
    }
  } else {
    console.log('Placement not ready');
  }
};
const onSurveyWallOpened = placement => {
  console.log('Survey Wall Opened with, placement: ', placement);
};

const createOnPlacementReady = (
  setPlacements: React.Dispatch<React.SetStateAction<Placement>>,
) => {
  return placement => {
    console.log('onPlacementReady: ', placement);
    if (
      placement.placementCode !== PLACEMENT_CODE_SDK_NOT_READY &&
      !!placement.isSurveyWallAvailable
    ) {
      setPlacements(placements => [
        ...placements.filter(
          p => p.placementIdentifier !== placement.placementIdentifier,
        ),
        placement,
      ]);
    }
  };
};

const setup = (
  setPlacements: React.Dispatch<React.SetStateAction<Placement>>,
  setButtonPressed: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setButtonPressed(false);
  console.log(
    `Setting up callbacks. API token ${API_TOKEN}, unique user ${USER_IDENTIFIER}`,
  );
  tapResearchEmitter.addListener(
    'tapResearchOnPlacementReady',
    createOnPlacementReady(setPlacements),
  );

  tapResearchEmitter.addListener(
    'tapResearchOnPlacementUnavailable',
    createOnPlacementUnavailable(setPlacements),
  );

  tapResearchEmitter.addListener(
    'tapResearchOnReceivedRewardCollection',
    rewards => {
      tapResearchOnReceivedRewardCollection(rewards);
    },
  );

  tapResearchEmitter.addListener('tapResearchOnSurveyWallOpened', placement => {
    onSurveyWallOpened(placement);
  });

  tapResearchEmitter.addListener('tapResearchOnSurveyWallDismissed', () => {
    // Should make a call to fetch placements again
    onSurveyWallClosed();
  });

  tapResearchEmitter.addListener('tapResearchOnEventOpened', event => {
    onEventOpened(event);
  });

  tapResearchEmitter.addListener('tapResearchOnEventDismissed', event => {
    onEventDismissed(event);
  });

  // End listeners
};
export default function Placements({}: NewplacementsProps) {
  const [placements, setPlacements] = useState<Placement>([]);
  const [, setButtonPressed] = useState(false);
  useEffect(() => {
    RNTapResearch.initWithApiToken(API_TOKEN);
    RNTapResearch.setUniqueUserIdentifier(USER_IDENTIFIER);
    RNTapResearch.setReceiveRewardCollection(true);
  }, []);

  useEffect(() => {
    setup(setPlacements, setButtonPressed);
  }, []);

  return (
    <View key={placements.length}>
      {placements.length > 0 &&
        placements.map(placement => (
          <View
            style={styles.container}
            key={placement.placementIdentifier + 'a'}>
            <Button
              key={placement.placementIdentifier}
              onPress={() => onSurveyButtonPressed(placement)}
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
