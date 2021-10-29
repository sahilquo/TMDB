import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import HorizontalItem from '../../components/HorizontalItem';
import SectionHeader from '../../components/SectionHeader';
import VerticalItem from '../../components/VerticalItem';
import { globalStyles } from '../../utils/globalStyles';
import { GET_ALL } from '../../network/Api';
import { ActivityIndicator } from 'react-native-paper';
import { colorAccent } from '../../utils/colors';
import { API_TV_GENRES, API_TV_AIRING_TODAY, API_TV_TRENDING, API_TV_TOP_RATED, API_TV_POPULAR } from '../../network/NetworkData';

const TVShowsHome = () => {
    const [isLoading, setLoading] = useState(true);
    const [genre, setGenre] = useState([]);
    const [airingToday, setAiringToday] = useState([]);
    const [trending, setTrending] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [popular, setPopular] = useState([]);

    useEffect(() => {
        GET_ALL(
            [
                API_TV_GENRES,
                API_TV_AIRING_TODAY,
                API_TV_TRENDING,
                API_TV_TOP_RATED,
                API_TV_POPULAR
            ],
            (jsons) => {
                setGenre(jsons[0].genres)
                setAiringToday(jsons[1].results);
                setTrending(jsons[2].results);
                setTopRated(jsons[3].results);
                setPopular(jsons[4].results);

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
                        title='Airing Today'
                        showAll={() => { }} />
                    <FlatList
                        style={{ flexGrow: 0 }}
                        showsHorizontalScrollIndicator={false}
                        data={airingToday}
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
                </View>
            </ScrollView>
        );
    }
}

const getHorizontalRenderItem = (item, genre) => {
    const genreNamesList = genre.filter(it => item['genre_ids'].includes(it.id)).map(it => it.name).join(", ")
    return <HorizontalItem imageUrl={item['backdrop_path']} title={item['name']} description={genreNamesList} />
}

const getVerticalRenderItem = (item, genre) => {
    const genreNamesList = genre.filter(it => item['genre_ids'].includes(it.id)).map(it => it.name).join(", ")
    return <VerticalItem imageUrl={item['poster_path']} title={item['name']} description={genreNamesList} />
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default TVShowsHome;