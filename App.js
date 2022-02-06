/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Switch,
  Button
} from 'react-native';

import BackgroundGeolocation from "react-native-background-geolocation";

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [enabled, setEnabled] = React.useState(false);
  const [isMoving, setIsMoving] = React.useState(false);

  React.useEffect(() => {
    const onLocation = BackgroundGeolocation.onLocation((location) => {
      console.log('[onLocation] ', location);
    });

    const onMotionChange = BackgroundGeolocation.onMotionChange((location) => {
      console.log('[onMotionChange] ', location);
    });

    const onEnabledChange = BackgroundGeolocation.onEnabledChange((enabled) => {
      console.log('[onEnabledChange] ', enabled);
    });

    const onActivityChange = BackgroundGeolocation.onActivityChange((event) => {
      console.log('[onActivityChange] ', event);
    });

    BackgroundGeolocation.ready({
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopTimeout: 60,
      locationAuthorizationRequest: 'WhenInUse',
      distanceFilter: 0,
      pausesLocationUpdatesAutomatically: false,
      disableStopDetection: true
    }).then((state) => {
      console.log('- state: ', state);

      setEnabled(state.enabled);
      setIsMoving(state.isMoving);
    });

    return () => {
      console.info('unsubscribe');
      onLocation.remove();
      onMotionChange.remove();
      onEnabledChange.remove();
      onActivityChange.remove();
    }
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onClickChangePace = async () => {
    const nowMoving = !isMoving;
    BackgroundGeolocation.changePace(nowMoving);
    setIsMoving(nowMoving);
  }

  const onToggleEnabled = async () => {
    const isEnabled = !enabled;

    if (isEnabled) {
      await BackgroundGeolocation.start();
      await BackgroundGeolocation.changePace(true);
      setIsMoving(true);
    } else {
      BackgroundGeolocation.stop();
      setIsMoving(false);
    }

    setEnabled(isEnabled);
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>

        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,

          }}>

        </View>
        <View>
          <Switch onValueChange={() => onToggleEnabled()} value={enabled} />
        </View>
          <Button title={"changePace (isMoving: " + isMoving + ")"} onPress={() => onClickChangePace()} />
        <View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
