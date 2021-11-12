import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { TabBar, TabView } from 'react-native-tab-view';
import { MOVIE_DETAIL, PERSON_DETAIL, TV_SHOW_DETAIL } from '../../navigators/NavigatorNames';
import { createUrl, GET, GET_ALL } from '../../network/Api';
import { API_DISCOVER_MOVIES, API_DISCOVER_TV, API_MOVIES_GENRES, API_MOVIE_CREDITS, API_TV_GENRES, PARAM_LANGUAGE, PARAM_LANGUAGE_VALUE, PARAM_PAGE, PARAM_WITH_GENRES, VAR_MOVIE_ID } from '../../network/NetworkData';
import { colorAccent, colorPrimary, colorPrimaryDark } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import { distinctArray } from '../../utils/ValueUtils';
import MovieListItem from '../movies/MovieListItem';
import PersonListItem from '../person/PersonListItem';

const GenreList = ({ route, navigation }) => {
    const { genreId, genreName } = route.params;

    const [isLoadingMovies, setLoadingMovies] = useState(true);
    const [genreMovies, setGenreMovies] = useState([]);
    const [movies, setMovies] = useState([]);
    const [currentPageMovies, setCurrentPageMovies] = useState(1);
    const [totalPageMovies, setTotalPageMovies] = useState(null);
    const [paginationRunningMovies, setPaginationRunningMovies] = useState(false);

    const [isLoadingTV, setLoadingTV] = useState(true);
    const [genreTV, setGenreTV] = useState([]);
    const [tvShows, setTVShows] = useState([]);
    const [currentPageTV, setCurrentPageTV] = useState(1);
    const [totalPageTV, setTotalPageTV] = useState(null);
    const [paginationRunningTV, setPaginationRunningTV] = useState(false);

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'movies', title: 'Movies' },
        { key: 'tv', title: 'Tv Shows' },
    ])

    navigation.setOptions({ title: `Genre: ${genreName}` })

    useEffect(() => {
        const params = {}
        params[PARAM_LANGUAGE] = PARAM_LANGUAGE_VALUE;
        params[PARAM_WITH_GENRES] = genreId;
        params[PARAM_PAGE] = currentPageMovies;
        console.log(createUrl(API_DISCOVER_MOVIES, params))

        if (currentPageMovies == 1) {
            GET_ALL(
                [
                    createUrl(API_MOVIES_GENRES),
                    createUrl(API_DISCOVER_MOVIES, params),
                ],
                (jsons) => {
                    setGenreMovies(jsons[0].genres)
                    setMovies(jsons[1].results);
                    setTotalPageMovies(jsons[1]['total_pages']);
                    setLoadingMovies(false);
                }),
                (error) => {
                    console.log(error);
                }

        } else {
            GET(
                createUrl(API_DISCOVER_MOVIES, params),
                (json) => {
                    const array = [...movies, ...json.results]
                    setMovies(distinctArray(array, 'id'));
                    setTotalPageMovies(json['total_pages']);
                    setPaginationRunningMovies(false);
                }),
                (error) => {
                    console.log(error);
                }

        }
    }, [currentPageMovies]);

    useEffect(() => {
        const params = {}
        params[PARAM_LANGUAGE] = PARAM_LANGUAGE_VALUE;
        params[PARAM_WITH_GENRES] = genreId;
        params[PARAM_PAGE] = currentPageTV;
        console.log(createUrl(API_DISCOVER_TV, params))

        if (currentPageTV == 1) {
            GET_ALL(
                [
                    createUrl(API_TV_GENRES),
                    createUrl(API_DISCOVER_TV, params),
                ],
                (jsons) => {
                    setGenreTV(jsons[0].genres)
                    setTVShows(jsons[1].results);
                    setTotalPageTV(jsons[1]['total_pages']);
                    setLoadingTV(false);
                }),
                (error) => {
                    console.log(error);
                }

        } else {
            GET(
                createUrl(API_DISCOVER_TV, params),
                (json) => {
                    const array = [...tvShows, ...json.results]
                    setTVShows(distinctArray(array, 'id'));
                    setTotalPageTV(json['total_pages']);
                    setPaginationRunningTV(false);
                }),
                (error) => {
                    console.log(error);
                }

        }
    }, [currentPageTV]);

    const onMoviesClick = (id) => {
        navigation.push(MOVIE_DETAIL, {
            movieId: id
        });
    }

    const onTvShowClick = (id) => {
        navigation.push(TV_SHOW_DETAIL, {
            tvId: id
        });
    }

    if (isLoadingMovies || isLoadingTV) {
        return (
            <View style={[globalStyles.container, styles.container]}>
                <ActivityIndicator size='large' color={colorAccent} />
            </View>
        );
    } else {
        if (movies.length > 0 && tvShows.length > 0) {
            const renderScene = ({ route }) => {
                switch (route.key) {
                    case 'movies':
                        return <MovieListComponent
                            list={movies}
                            genre={genreMovies}
                            onClick={onMoviesClick}
                            currentPageMovies={currentPageMovies}
                            totalPageMovies={totalPageMovies}
                            paginationRunningMovies={paginationRunningMovies}
                            loadMore={() => {
                                setPaginationRunningMovies(true)
                                setCurrentPageMovies(currentPageMovies + 1);
                            }} />;
                    case 'tv':
                        return <TvListComponent
                            list={tvShows}
                            genre={genreTV}
                            onClick={onTvShowClick}
                            currentPageTV={currentPageTV}
                            totalPageTV={totalPageTV}
                            paginationRunningTV={paginationRunningTV}
                            loadMore={() => {
                                setPaginationRunningTV(true)
                                setCurrentPageTV(currentPageTV + 1);
                            }} />;
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
            return (
                <View style={[{ flex: 1, backgroundColor: colorPrimary, }]}>
                    {
                        movies.length > 0
                            ? <MovieListComponent
                                list={movies}
                                genre={genreMovies}
                                onClick={onMoviesClick}
                                currentPageMovies={currentPageMovies}
                                totalPageMovies={totalPageMovies}
                                paginationRunningMovies={paginationRunningMovies}
                                loadMore={() => {
                                    setPaginationRunningMovies(true)
                                    setCurrentPageMovies(currentPageMovies + 1);
                                }} />
                            : <TvListComponent
                                list={tvShows}
                                genre={genreTV}
                                onClick={onTvShowClick}
                                currentPageTV={currentPageTV}
                                totalPageTV={totalPageTV}
                                paginationRunningTV={paginationRunningTV}
                                loadMore={() => {
                                    setPaginationRunningTV(true)
                                    setCurrentPageTV(currentPageTV + 1);
                                }} />
                    }
                </View>
            );
        }
    }
}

const MovieListComponent = ({ list, genre, onClick, currentPageMovies, totalPageMovies, paginationRunningMovies, loadMore }) => {
    return (
        <FlatList
            data={list}
            keyExtractor={({ id }) => id}
            renderItem={({ item }) => getVerticalRenderItem(item, genre, onClick)}
            onEndReached={({ distanceFromEnd }) => {
                if (currentPageMovies < totalPageMovies && !paginationRunningMovies) {
                    loadMore()
                    // setPaginationRunningMovies(true)
                    // setCurrentPageMovies(currentPageMovies + 1);
                    console.log(distanceFromEnd)
                }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
                paginationRunningMovies
                    ?
                    <View style={[styles.container, { margin: 8 }]}>
                        <ActivityIndicator size='small' color={colorAccent} />
                    </View>
                    : null
            }
        />
    );
}

const TvListComponent = ({ list, genre, onClick, currentPageTV, totalPageTV, paginationRunningTV, loadMore }) => {
    return (
        <FlatList
            data={list}
            keyExtractor={({ id }) => id}
            renderItem={({ item }) => getVerticalRenderItem(item, genre, onClick)}
            onEndReached={({ distanceFromEnd }) => {
                if (currentPageTV < totalPageTV && !paginationRunningTV) {
                    loadMore()
                    // setPaginationRunningMovies(true)
                    // setCurrentPageMovies(currentPageMovies + 1);
                    console.log(distanceFromEnd)
                }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
                paginationRunningTV
                    ?
                    <View style={[styles.container, { margin: 8 }]}>
                        <ActivityIndicator size='small' color={colorAccent} />
                    </View>
                    : null
            }
        />
    );
}

const getVerticalRenderItem = (item, genre, onClick) => {
    const genreNamesList = genre.filter(it => item['genre_ids'].includes(it.id)).map(it => it.name).join(", ")
    const title = item.title != null ? item.title : item.name;
    return <MovieListItem
        item={item}
        title={title}
        genreText={genreNamesList}
        onClick={(id) => {
            onClick(id)
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

export default GenreList;