import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { TabBar, TabView } from 'react-native-tab-view';
import { PERSON_DETAIL } from '../../navigators/NavigatorNames';
import { createUrl, GET_ALL } from '../../network/Api';
import { API_MOVIE_CREDITS, PARAM_LANGUAGE, PARAM_LANGUAGE_VALUE, VAR_MOVIE_ID } from '../../network/NetworkData';
import { colorAccent, colorPrimary, colorPrimaryDark } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import { distinctArray } from '../../utils/ValueUtils';
import PersonListItem from '../person/PersonListItem';

const MovieCredits = ({ route, navigation }) => {
    const { movieId } = route.params;

    const [isLoading, setLoading] = useState(true);
    const [movieCasts, setMovieCasts] = useState([]);
    const [movieCrews, setMovieCrews] = useState([]);

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'cast', title: 'Cast' },
        { key: 'crew', title: 'Crew' },
    ])

    useEffect(() => {
        const params = {}
        params[PARAM_LANGUAGE] = PARAM_LANGUAGE_VALUE;
        console.log(createUrl(API_MOVIE_CREDITS.replace(VAR_MOVIE_ID, movieId), params))

        GET_ALL(
            [
                createUrl(API_MOVIE_CREDITS.replace(VAR_MOVIE_ID, movieId), params),
            ],
            (jsons) => {
                setMovieCasts(distinctArray(jsons[0].cast, 'id'));
                setMovieCrews(distinctArray(jsons[0].crew, 'id'));
                setLoading(false);
            }),
            (error) => {
                console.log(error);
            }
    }, []);

    const onPersonClick = (id) => {
        navigation.push(PERSON_DETAIL, {
            personId: id
        });
    }

    if (isLoading || (movieCasts === null && movieCrews === null)) {
        return (
            <View style={[globalStyles.container, styles.container]}>
                <ActivityIndicator size='large' color={colorAccent} />
            </View>
        );
    } else {
        if (movieCasts.length > 0 && movieCrews.length > 0) {
            const renderScene = ({ route }) => {
                switch (route.key) {
                    case 'cast':
                        return <ListComponent list={movieCasts} onPersonClick={onPersonClick} />;
                    case 'crew':
                        return <ListComponent list={movieCrews} onPersonClick={onPersonClick} />;
                    default:
                        return null;
                }
            };

            return (
                <View style={[{ flex: 1, backgroundColor: colorPrimary, }]}>

                    <TabView
                        navigationState={{ index, routes }}
                        onIndexChange={setIndex}
                        renderScene={renderScene}
                        initialLayout={{ width: Dimensions.get('window').width }}
                        style={styles.tabbar}
                        renderTabBar={props => <TabBar {...props}
                            style={{ backgroundColor: colorPrimaryDark }}
                            indicatorStyle={{ backgroundColor: colorAccent }}
                            labelStyle={{ textTransform: 'none' }}
                        />}
                    />

                </View>
            );
        } else {
            const list = movieCasts.length > 0 ? movieCasts : movieCrews;
            return (
                <View style={[{ flex: 1, backgroundColor: colorPrimary, }]}>
                    <ListComponent list={list} onPersonClick={onPersonClick} />
                </View>
            );
        }
    }
}

const ListComponent = ({ list, onPersonClick }) => {
    return (
        <FlatList
            data={list}
            keyExtractor={({ id }) => id}
            renderItem={({ item }) => getVerticalRenderItem(item, onPersonClick)}
        />
    );
}

const getVerticalRenderItem = (item, onPersonClick) => {
    return <PersonListItem
        item={item}
        onClick={(id) => {
            onPersonClick(id)
        }}
    />
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabbar: {
        backgroundColor: colorPrimary
    }
});

export default MovieCredits;