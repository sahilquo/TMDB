import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';
import TabNavigator from './navigators/TabNavigator';
import MoviesHome from './screens/home/MoviesHome';

const App = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

export default App;