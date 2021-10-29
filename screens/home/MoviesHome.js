import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import HorizontalItem from '../../components/HorizontalItem';
import SectionHeader from '../../components/SectionHeader';
import VerticalItem from '../../components/VerticalItem';
import { globalStyles } from '../../utils/globalStyles';
import { GET_ALL } from '../../network/Api';
import { API_MOVIES_GENRES, API_MOVIES_POPULAR, API_MOVIES_NOW_PLAYING, API_MOVIES_TRENDING, API_MOVIES_UPCOMING, API_MOVIES_TOP_RATED } from '../../network/NetworkData';
import { ActivityIndicator } from 'react-native-paper';
import { colorAccent } from '../../utils/colors';

const MoviesHome = () => {
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
                API_MOVIES_GENRES,
                API_MOVIES_POPULAR,
                API_MOVIES_NOW_PLAYING,
                API_MOVIES_TRENDING,
                API_MOVIES_TOP_RATED,
                API_MOVIES_UPCOMING
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
                        showAll={() => { }} />
                    <FlatList
                        style={{ flexGrow: 0 }}
                        showsHorizontalScrollIndicator={false}
                        data={popular}
                        horizontal
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) => getVerticalRenderItem(item, genre)}
                    />
                    <SectionHeader
                        title='Playing In Theatres'
                        showAll={() => { }} />
                    <FlatList
                        style={{ flexGrow: 0 }}
                        showsHorizontalScrollIndicator={false}
                        data={nowPlaying}
                        horizontal
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) => getHorizontalRenderItem(item, genre)}
                    />
                    <SectionHeader
                        title='Trending'
                        showAll={() => { }} />
                    <FlatList
                        style={{ flexGrow: 0 }}
                        showsHorizontalScrollIndicator={false}
                        data={trending}
                        horizontal
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) => getVerticalRenderItem(item, genre)}
                    />
                    <SectionHeader
                        title='Top Rated'
                        showAll={() => { }} />
                    <FlatList
                        style={{ flexGrow: 0 }}
                        showsHorizontalScrollIndicator={false}
                        data={topRated}
                        horizontal
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) => getHorizontalRenderItem(item, genre)}
                    />
                    <SectionHeader
                        title='Upcoming'
                        showAll={() => { }} />
                    <FlatList
                        style={{ flexGrow: 0 }}
                        showsHorizontalScrollIndicator={false}
                        data={upcoming}
                        horizontal
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) => getVerticalRenderItem(item, genre)}
                    />
                </View>
            </ScrollView>

        );
    }
}

const getHorizontalRenderItem = (item, genre) => {
    const genreNamesList = genre.filter(it => item['genre_ids'].includes(it.id)).map(it => it.name).join(", ")
    return <HorizontalItem imageUrl={item['backdrop_path']} title={item['title']} description={genreNamesList} />
}

const getVerticalRenderItem = (item, genre) => {
    const genreNamesList = genre.filter(it => item['genre_ids'].includes(it.id)).map(it => it.name).join(", ")
    return <VerticalItem imageUrl={item['poster_path']} title={item['title']} description={genreNamesList} />
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default MoviesHome;