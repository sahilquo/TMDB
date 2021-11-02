import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CelebritiesHome from '../screens/home/CelebritiesHome';
import MoviesHome from '../screens/home/MoviesHome';
import TVShowsHome from '../screens/home/TVShowsHome';
import { colorAccent, colorPrimaryDark } from '../utils/colors';
import { CELEBRITIES_HOME_STACK, MOVIES_HOME_STACK, TV_SHOWS_HOME_STACK } from './NavigatorNames';
import { MoviesHomeStack, CelebritiesHomeStack, TVShowsHomeStack } from './StackNavigator';

const Tab = createMaterialBottomTabNavigator();

const screenOptions = (route, color) => {
    let iconName;

    switch (route.name) {
        case MOVIES_HOME_STACK:
            iconName = 'local-movies';
            break;
        case TV_SHOWS_HOME_STACK:
            iconName = 'tv';
            break;
        case CELEBRITIES_HOME_STACK:
            iconName = 'person';
            break;
    }

    return <Icon name={iconName} color={color} size={24} />;
}

const TabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName={MOVIES_HOME_STACK}
            activeColor={colorAccent}
            inactiveColor='white'
            barStyle={{ backgroundColor: colorPrimaryDark }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => screenOptions(route, color),
            })}
        >
            <Tab.Screen
                name={MOVIES_HOME_STACK}
                component={MoviesHomeStack}
                options={{
                    title: 'Movies'
                }} />

            <Tab.Screen
                name={TV_SHOWS_HOME_STACK}
                component={TVShowsHomeStack}
                options={{
                    title: 'Tv Shows'
                }} />

            {/* <Tab.Screen
                name={CELEBRITIES_HOME_STACK}
                component={CelebritiesHomeStack}
                options={{
                    title: 'Celebrities'
                }} /> */}
        </Tab.Navigator>
    );
}

export default TabNavigator;