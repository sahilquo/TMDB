import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppStatusBar from './components/AppStatusBar';
import { MainStack } from './navigators/StackNavigator';
import { colorPrimaryDark } from './utils/colors';

const THEME_COLOR = colorPrimaryDark;

const App = () => {
  return (
    <>
      <SafeAreaView style={styles.topSafeArea} />
      <SafeAreaView style={styles.bottomSafeArea}>
        <AppStatusBar backgroundColor={THEME_COLOR} barStyle="light-content" />
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </SafeAreaView>
    </>

  );
}

const styles = StyleSheet.create({
  topSafeArea: {
    flex: 0,
    backgroundColor: THEME_COLOR
  },
  bottomSafeArea: {
    flex: 1,
    backgroundColor: THEME_COLOR
  },
});

export default App;