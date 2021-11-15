import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { MOVIE_DETAIL } from '../../navigators/NavigatorNames';
import { createUrl, GET, GET_ALL } from '../../network/Api';
import { API_MOVIES_GENRES, PARAM_LANGUAGE, PARAM_LANGUAGE_VALUE, PARAM_PAGE } from '../../network/NetworkData';
import { colorAccent, colorPrimary } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import MovieListItem from './MovieListItem';

const MovieList = ({ route, navigation }) => {
    const { title, apiUrl } = route.params;

    const [isLoading, setLoading] = useState(true);
    const [genre, setGenre] = useState([]);
    const [movieList, setMovieList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(null);
    const [paginationRunning, setpaginationRunning] = useState(false);

    useEffect(() => {
        updateParams(navigation, title)
    }, [title]);

    useEffect(() => {
        const params = {}
        params[PARAM_LANGUAGE] = PARAM_LANGUAGE_VALUE;
        params[PARAM_PAGE] = currentPage;
        console.log(createUrl(apiUrl, params))

        if (currentPage == 1) {
            GET_ALL(
                [
                    createUrl(API_MOVIES_GENRES),
                    createUrl(apiUrl, params),
                ],
                (jsons) => {
                    setGenre(jsons[0].genres)
                    setMovieList(jsons[1].results);
                    setTotalPage(jsons[1]['total_pages']);
                    setLoading(false);
                }),
                (error) => {
                    console.log(error);
                }

        } else {
            GET(
                createUrl(apiUrl, params),
                (json) => {
                    const array = [...movieList, ...json.results]
                    setMovieList(array.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i));
                    setTotalPage(json['total_pages']);
                    setpaginationRunning(false);
                }),
                (error) => {
                    console.log(error);
                }

        }
    }, [currentPage]);

    const onMovieClick = (id) => {
        navigation.push(MOVIE_DETAIL, {
            movieId: id
        });
    }

    if (isLoading || movieList === null) {
        return (
            <View style={[globalStyles.container, styles.container]}>
                <ActivityIndicator size='large' color={colorAccent} />
            </View>
        );
    } else {
        return (
            <View style={[{ flex: 1, backgroundColor: colorPrimary, }]}>

                <FlatList
                    data={movieList}
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => getVerticalRenderItem(item, genre, onMovieClick)}
                    onEndReached={({ distanceFromEnd }) => {
                        if (currentPage < totalPage && !paginationRunning) {
                            setpaginationRunning(true)
                            setCurrentPage(currentPage + 1);
                            console.log(distanceFromEnd)
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        paginationRunning
                            ?
                            <View style={[styles.container, { margin: 8 }]}>
                                <ActivityIndicator size='small' color={colorAccent} />
                            </View>
                            : null
                    }
                />

            </View>
        );
    }
}

const updateParams = (navigation, title) => {
    if (title != null) {
        navigation.setOptions({ title: title })
    }
}

const getVerticalRenderItem = (item, genre, onMovieClick) => {
    const genreNamesList = genre.filter(it => item['genre_ids'].includes(it.id)).map(it => it.name).join(", ")
    return <MovieListItem
        item={item}
        title={item.title}
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
});

export default MovieList;