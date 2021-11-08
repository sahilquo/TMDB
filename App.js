import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { MainStack } from './navigators/StackNavigator';
import TabNavigator from './navigators/TabNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}

export default App;