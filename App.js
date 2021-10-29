import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import TabNavigator from './navigators/TabNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

export default App;