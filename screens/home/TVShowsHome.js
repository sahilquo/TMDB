import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import HorizontalItem from '../../components/HorizontalItem';
import SectionHeader from '../../components/SectionHeader';
import VerticalItem from '../../components/VerticalItem';
import { globalStyles } from '../../utils/globalStyles';
import { createUrl, GET_ALL } from '../../network/Api';
import { ActivityIndicator } from 'react-native-paper';
import { colorAccent } from '../../utils/colors';
import { API_TV_GENRES, API_TV_AIRING_TODAY, API_TV_TRENDING, API_TV_TOP_RATED, API_TV_POPULAR } from '../../network/NetworkData';
import { TV_SHOW_DETAIL } from '../../navigators/NavigatorNames';

const TVShowsHome = ({ navigation }) => {
    const [isLoading, setLoading] = useState(true);
    const [genre, setGenre] = useState([]);
    const [airingToday, setAiringToday] = useState([]);
    const [trending, setTrending] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [popular, setPopular] = useState([]);

    useEffect(() => {
        GET_ALL(
            [
                createUrl(API_TV_GENRES),
                createUrl(API_TV_AIRING_TODAY),
                createUrl(API_TV_TRENDING),
                createUrl(API_TV_TOP_RATED),
                createUrl(API_TV_POPULAR)
            ],
            (jsons) => {
                setGenre(jsons[0].genres)
                console.log(jsons[1].results)
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

    const onTvShowClick = (id) => {
        navigation.navigate(TV_SHOW_DETAIL, {
            tvId: id
        });
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
                        title='Airing Today'
                        showAll={() => { }} />
                    <FlatList
                        style={{ flexGrow: 0 }}
                        showsHorizontalScrollIndicator={false}
                        data={airingToday}
                        horizontal
                        keyExtractor={({ id }) => id}
                        renderItem={({ item }) => getHorizontalRenderItem(item, genre, onTvShowClick)}
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
                        renderItem={({ item }) => getVerticalRenderItem(item, genre, onTvShowClick)}
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
                        renderItem={({ item }) => getHorizontalRenderItem(item, genre, onTvShowClick)}
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
                        renderItem={({ item }) => getVerticalRenderItem(item, genre, onTvShowClick)}
                    />
                </View>
            </ScrollView>
        );
    }
}

const getHorizontalRenderItem = (item, genre, onTvShowClick) => {
    const genreNamesList = genre.filter(it => item['genre_ids'].includes(it.id)).map(it => it.name).join(", ")
    return <HorizontalItem
        imageUrl={item['backdrop_path']}
        title={item['name']}
        description={genreNamesList}
        onClick={(id) => {
            onTvShowClick(id)
        }} />
}

const getVerticalRenderItem = (item, genre, onTvShowClick) => {
    const genreNamesList = genre.filter(it => item['genre_ids'].includes(it.id)).map(it => it.name).join(", ")
    return <VerticalItem
        imageUrl={item['poster_path']}
        title={item['name']}
        description={genreNamesList}
        onClick={(id) => {
            onTvShowClick(id)
        }} />
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default TVShowsHome;