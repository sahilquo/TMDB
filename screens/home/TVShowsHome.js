import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import HorizontalItem from '../../components/HorizontalItem';
import SectionHeader from '../../components/SectionHeader';
import VerticalItem from '../../components/VerticalItem';
import { globalStyles } from '../../utils/globalStyles';
import { createUrl, GET_ALL } from '../../network/Api';
import { ActivityIndicator } from 'react-native-paper';
import { colorAccent } from '../../utils/colors';
import { API_TV_GENRES, API_TV_AIRING_TODAY, API_TV_TRENDING, API_TV_TOP_RATED, API_TV_POPULAR, PARAM_REGION, PARAM_REGION_VALUE, PARAM_LANGUAGE, PARAM_LANGUAGE_VALUE } from '../../network/NetworkData';
import { ALL_SCREENS, TV_SHOW_DETAIL, TV_SHOW_LIST } from '../../navigators/NavigatorNames';

const TVShowsHome = ({ navigation }) => {
    const [isLoading, setLoading] = useState(true);
    const [genre, setGenre] = useState([]);
    const [airingToday, setAiringToday] = useState([]);
    const [trending, setTrending] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [popular, setPopular] = useState([]);

    useEffect(() => {
        const params = {}
        params[PARAM_LANGUAGE] = PARAM_LANGUAGE_VALUE;
        params[PARAM_REGION] = PARAM_REGION_VALUE;
        console.log(createUrl(API_TV_AIRING_TODAY, params))
        GET_ALL(
            [
                createUrl(API_TV_GENRES),
                createUrl(API_TV_AIRING_TODAY, params),
                createUrl(API_TV_TRENDING, params),
                createUrl(API_TV_TOP_RATED, params),
                createUrl(API_TV_POPULAR, params)
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

    const onTvShowClick = (id) => {
        navigation.push(ALL_SCREENS, {
            screen: TV_SHOW_DETAIL,
            params: {
                tvId: id
            }
        })
    }

    const onSeeAllClick = (title, apiUrl) => {
        navigation.push(ALL_SCREENS, {
            screen: TV_SHOW_LIST,
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
                        title='Airing Today'
                        showAll={() => { onSeeAllClick('Airing Today', API_TV_AIRING_TODAY) }} />
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
                        showAll={() => { onSeeAllClick('Trending', API_TV_TRENDING) }} />
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
                        showAll={() => { onSeeAllClick('Top Rated', API_TV_TOP_RATED) }} />
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
                        showAll={() => { onSeeAllClick('Popular', API_TV_POPULAR) }} />
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
        id={item.id}
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
        id={item.id}
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