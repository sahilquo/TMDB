import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { TabBar, TabView } from 'react-native-tab-view';
import { MOVIE_DETAIL, TV_SHOW_DETAIL } from '../../navigators/NavigatorNames';
import { createUrl, GET_ALL } from '../../network/Api';
import { PARAM_LANGUAGE, PARAM_LANGUAGE_VALUE } from '../../network/NetworkData';
import { colorAccent, colorPrimary, colorPrimaryDark } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import { distinctArray } from '../../utils/ValueUtils';
import MovieListItem from '../movies/MovieListItem';

const PersonCreditsList = ({ route, navigation }) => {
    const { title, apiUrl, genreApiUrl } = route.params;

    const [isLoading, setLoading] = useState(true);
    const [genre, setGenre] = useState([]);
    const [personCastCredits, setPersonCastCredits] = useState([]);
    const [personCrewCredits, setPersonCrewCredits] = useState([]);

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'cast', title: 'Cast' },
        { key: 'crew', title: 'Crew' },
    ])

    useEffect(() => {
        updateParams(navigation, title)
    }, [title]);

    useEffect(() => {
        const params = {}
        params[PARAM_LANGUAGE] = PARAM_LANGUAGE_VALUE;
        console.log(createUrl(apiUrl, params))

        GET_ALL(
            [
                createUrl(genreApiUrl),
                createUrl(apiUrl, params),
            ],
            (jsons) => {
                setGenre(jsons[0].genres)
                setPersonCastCredits(distinctArray(jsons[1].cast, 'id'));
                setPersonCrewCredits(distinctArray(jsons[1].crew, 'id'));
                setLoading(false);
            }),
            (error) => {
                console.log(error);
            }
    }, []);

    const onMovieClick = (id) => {
        if (title == 'Movies') {
            navigation.push(MOVIE_DETAIL, {
                movieId: id
            });
        } else {
            navigation.push(TV_SHOW_DETAIL, {
                tvId: id
            });
        }
    }

    if (isLoading || (personCastCredits === null && personCrewCredits === null)) {
        return (
            <View style={[globalStyles.container, styles.container]}>
                <ActivityIndicator size='large' color={colorAccent} />
            </View>
        );
    } else {
        if (personCastCredits.length > 0 && personCrewCredits.length > 0) {
            const renderScene = ({ route }) => {
                switch (route.key) {
                    case 'cast':
                        return <ListComponent list={personCastCredits} genre={genre} onMovieClick={onMovieClick} />;
                    case 'crew':
                        return <ListComponent list={personCrewCredits} genre={genre} onMovieClick={onMovieClick} />;
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
            const list = personCastCredits.length > 0 ? personCastCredits : personCrewCredits;
            return (
                <View style={[{ flex: 1, backgroundColor: colorPrimary, }]}>
                    <ListComponent list={list} genre={genre} onMovieClick={onMovieClick} />
                </View>
            );
        }
    }
}

const ListComponent = ({ list, genre, onMovieClick }) => {
    return (
        <FlatList
            data={list}
            keyExtractor={({ id }) => id}
            renderItem={({ item }) => getVerticalRenderItem(item, genre, onMovieClick)}
        />
    );
}

const updateParams = (navigation, title) => {
    if (title != null) {
        navigation.setOptions({ title: title })
    }
}

const getVerticalRenderItem = (item, genre, onMovieClick) => {
    const genreNamesList = genre.filter(it => item['genre_ids'].includes(it.id)).map(it => it.name).join(", ")
    let title = item.title != null ? item.title : item.name;
    return <MovieListItem
        item={item}
        title={title}
        genreText={genreNamesList}
        onClick={(id) => {
            onMovieClick(id)
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

export default PersonCreditsList;