import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CelebritiesHome from '../screens/home/CelebritiesHome';
import MoviesHome from '../screens/home/MoviesHome';
import TVShowsHome from '../screens/home/TVShowsHome';
import MovieCollectionDetail from '../screens/movies/MovieCollectionDetail';
import MovieCredits from '../screens/movies/MovieCredits';
import MovieDetail from '../screens/movies/MovieDetail';
import MovieList from '../screens/movies/MovieList';
import PersonCreditsList from '../screens/person/PersonCreditsList';
import PersonDetail from '../screens/person/PersonDetail';
import PersonList from '../screens/person/PersonList';
import TVSeasonDetail from '../screens/tv/TVSeasonDetail';
import TvShowCredits from '../screens/tv/TvShowCredits';
import TVShowDetail from '../screens/tv/TVShowDetail';
import TVShowList from '../screens/tv/TVShowList';
import { colorPrimaryDark } from '../utils/colors';
import { ALL_SCREENS, CELEBRITIES_HOME, MOVIES_HOME, MOVIE_COLLECTION_DETAIL, MOVIE_CREDITS, MOVIE_DETAIL, MOVIE_LIST, PERSON_CREDITS, PERSON_DETAIL, PERSON_LIST, TAB_STACK, TV_SEASON_DETAIL, TV_SHOWS_HOME, TV_SHOW_CREDITS, TV_SHOW_DETAIL, TV_SHOW_LIST } from './NavigatorNames';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const screenOptions = {
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: colorPrimaryDark
    }
};

const MainStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen
                name={TAB_STACK}
                component={TabNavigator}
            />
            <Stack.Screen
                name={ALL_SCREENS}
                component={AllStack}
            />
        </Stack.Navigator>
    );
}

const AllStack = () => {
    return (
        <Stack.Navigator
            screenOptions={screenOptions}>
            <Stack.Screen
                name={MOVIE_DETAIL}
                component={MovieDetail}
                options={{
                    title: ''
                }}
            />
            <Stack.Screen
                name={TV_SHOW_DETAIL}
                component={TVShowDetail}
                options={{
                    title: ''
                }} />
            <Stack.Screen
                name={PERSON_DETAIL}
                component={PersonDetail}
                options={{
                    title: ''
                }} />
            <Stack.Screen
                name={MOVIE_COLLECTION_DETAIL}
                component={MovieCollectionDetail}
                options={{
                    title: ''
                }} />
            <Stack.Screen
                name={TV_SEASON_DETAIL}
                component={TVSeasonDetail}
                options={{
                    title: ''
                }} />
            <Stack.Screen
                name={MOVIE_LIST}
                component={MovieList}
                options={{
                    title: ''
                }} />
            <Stack.Screen
                name={TV_SHOW_LIST}
                component={TVShowList}
                options={{
                    title: ''
                }} />
            <Stack.Screen
                name={PERSON_LIST}
                component={PersonList}
                options={{
                    title: ''
                }} />
            <Stack.Screen
                name={PERSON_CREDITS}
                component={PersonCreditsList}
                options={{
                    title: ''
                }} />
            <Stack.Screen
                name={MOVIE_CREDITS}
                component={MovieCredits}
                options={{
                    title: 'Credits'
                }} />
            <Stack.Screen
                name={TV_SHOW_CREDITS}
                component={TvShowCredits}
                options={{
                    title: 'Credits'
                }} />
        </Stack.Navigator>
    );
}

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
            {/* <Stack.Screen
                name={MOVIE_DETAIL}
                component={MovieDetail}
                options={{
                    title: ''
                }}
            /> */}
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
            {/* <Stack.Screen
                name={TV_SHOW_DETAIL}
                component={TVShowDetail}
                options={{
                    title: ''
                }} /> */}
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
            {/* <Stack.Screen
                name={PERSON_DETAIL}
                component={PersonDetail}
                options={{
                    title: ''
                }} /> */}
        </Stack.Navigator>
    );
};

export { MainStack, AllStack, MoviesHomeStack, TVShowsHomeStack, CelebritiesHomeStack };