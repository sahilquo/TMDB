import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import HorizontalItem from '../../components/HorizontalItem';
import SectionHeader from '../../components/SectionHeader';
import VerticalItem from '../../components/VerticalItem';
import { globalStyles } from '../../utils/globalStyles';
import { createUrl, GET_ALL } from '../../network/Api';
import { API_MOVIES_GENRES, API_MOVIES_POPULAR, API_MOVIES_NOW_PLAYING, API_MOVIES_TRENDING, API_MOVIES_UPCOMING, API_MOVIES_TOP_RATED } from '../../network/NetworkData';
import { ActivityIndicator } from 'react-native-paper';
import { colorAccent } from '../../utils/colors';
import { ALL_SCREENS, MOVIE_DETAIL, MOVIE_LIST } from '../../navigators/NavigatorNames';


const MoviesHome = ({ navigation }) => {
    const [isLoading, setLoading] = useState(true);
    const [genre, setGenre] = useState([]);
    const [popular, setPopular] = useState([]);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [trending, setTrending] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [upcoming, setUpcoming] = useState([]);

    useEffect(() => {
        GET_ALL(
            [
                createUrl(API_MOVIES_GENRES),
                createUrl(API_MOVIES_POPULAR),
                createUrl(API_MOVIES_NOW_PLAYING),
                createUrl(API_MOVIES_TRENDING),
                createUrl(API_MOVIES_TOP_RATED),
                createUrl(API_MOVIES_UPCOMING)
            ],
            (jsons) => {
                setGenre(jsons[0].genres)
                setPopular(jsons[1].results);
                setNowPlaying(jsons[2].results);
                setTrending(jsons[3].results);
                setTopRated(jsons[4].results);
                setUpcoming(jsons[5].results);

                setLoading(false);
            }),
            (error) => {
                console.log(error);
            }
    }, []);

    const onMovieClick = (id) => {
        navigation.push(ALL_SCREENS, {
            screen: MOVIE_DETAIL,
            params: {
                movieId: id
            }
        })
        // navigation.navigate(MOVIE_DETAIL, {
        //     movieId: id
        // });
    }

    const onSeeAllClick = (title, apiUrl) => {
        navigation.push(ALL_SCREENS, {
            screen: MOVIE_LIST,
            params: {
                title: title,
                apiUrl: apiUrl
            }
        })
    }

    if (isLoading) {
        return (
            <View style={[globalStyles.container, styles.container]}>
                <ActivityIndicator size='large' color={colorAccent} />
            </View>
        );
    } else {
        return (
            <ScrollView>
                <View style={[globalStyles.container]}>
                    <SectionHeader
                        title='Popular'
                        showAll={() => { onSeeAllClick('Popular', API_MOVIES_POPULAR) }} />
                    <FlatList
                        style={{ flexGrow: 0 }}
                        showsHorizontalScrollIndicator={false}
                        data={popular}
                        horizontal
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) => getVerticalRenderItem(item, genre, onMovieClick)}
                    />
                    <SectionHeader
                        title='Playing In Theatres'
                        showAll={() => { onSeeAllClick('Playing In Theatres', API_MOVIES_NOW_PLAYING) }} />
                    <FlatList
                        style={{ flexGrow: 0 }}
                        showsHorizontalScrollIndicator={false}
                        data={nowPlaying}
                        horizontal
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) => getHorizontalRenderItem(item, genre, onMovieClick)}
                    />
                    <SectionHeader
                        title='Trending'
                        showAll={() => { onSeeAllClick('Trending', API_MOVIES_TRENDING) }} />
                    <FlatList
                        style={{ flexGrow: 0 }}
                        showsHorizontalScrollIndicator={false}
                        data={trending}
                        horizontal
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) => getVerticalRenderItem(item, genre, onMovieClick)}
                    />
                    <SectionHeader
                        title='Top Rated'
                        showAll={() => { onSeeAllClick('Top Rated', API_MOVIES_TOP_RATED) }} />
                    <FlatList
                        style={{ flexGrow: 0 }}
                        showsHorizontalScrollIndicator={false}
                        data={topRated}
                        horizontal
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) => getHorizontalRenderItem(item, genre, onMovieClick)}
                    />
                    <SectionHeader
                        title='Upcoming'
                        showAll={() => { onSeeAllClick('Upcoming', API_MOVIES_UPCOMING) }} />
                    <FlatList
                        style={{ flexGrow: 0 }}
                        showsHorizontalScrollIndicator={false}
                        data={upcoming}
                        horizontal
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) => getVerticalRenderItem(item, genre, onMovieClick)}
                    />
                </View>
            </ScrollView>

        );
    }
}

const getHorizontalRenderItem = (item, genre, onMovieClick) => {
    const genreNamesList = genre.filter(it => item['genre_ids'].includes(it.id)).map(it => it.name).join(", ")
    return <HorizontalItem
        id={item.id}
        imageUrl={item['backdrop_path']}
        title={item['title']}
        description={genreNamesList}
        onClick={(id) => {
            onMovieClick(id)
        }}
    />
}

const getVerticalRenderItem = (item, genre, onMovieClick) => {
    const genreNamesList = genre.filter(it => item['genre_ids'].includes(it.id)).map(it => it.name).join(", ")
    return <VerticalItem
        id={item.id}
        imageUrl={item['poster_path']}
        title={item['title']}
        description={genreNamesList}
        onClick={(id) => {
            onMovieClick(id)
        }}
    />
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default MoviesHome;