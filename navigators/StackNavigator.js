import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CelebritiesHome from '../screens/home/CelebritiesHome';
import MoviesHome from '../screens/home/MoviesHome';
import TVShowsHome from '../screens/home/TVShowsHome';
import { colorPrimaryDark } from '../utils/colors';
import { CELEBRITIES_HOME, MOVIES_HOME, TV_SHOWS_HOME } from './NavigatorNames';

const Stack = createNativeStackNavigator();

const screenOptions = {
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: colorPrimaryDark
    }
};

const MoviesHomeStack = () => {
    return (
        <Stack.Navigator
            screenOptions={screenOptions}>
            <Stack.Screen
                name={MOVIES_HOME}
                component={MoviesHome}
                options={{
                    title: 'Movies'
                }} />
        </Stack.Navigator>
    );
};

const TVShowsHomeStack = () => {
    return (
        <Stack.Navigator
            screenOptions={screenOptions}>
            <Stack.Screen
                name={TV_SHOWS_HOME}
                component={TVShowsHome}
                options={{
                    title: 'Tv Shows'
                }} />
        </Stack.Navigator>
    );
};

const CelebritiesHomeStack = () => {
    return (
        <Stack.Navigator
            screenOptions={screenOptions}>
            <Stack.Screen
                name={CELEBRITIES_HOME}
                component={CelebritiesHome}
                options={{
                    title: 'Celebrities'
                }} />
        </Stack.Navigator>
    );
};

export { MoviesHomeStack, TVShowsHomeStack, CelebritiesHomeStack };