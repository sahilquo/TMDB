import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import HorizontalItem from '../../components/HorizontalItem';
import SectionHeader from '../../components/SectionHeader';
import VerticalItem from '../../components/VerticalItem';
import { globalStyles } from '../../utils/globalStyles';
import { createUrl, GET_ALL } from '../../network/Api';
import { API_MOVIES_GENRES, API_MOVIES_POPULAR, API_MOVIES_NOW_PLAYING, API_MOVIES_TRENDING, API_MOVIES_UPCOMING, API_MOVIES_TOP_RATED, API_PERSON_POPULAR, API_PERSON_TRENDING } from '../../network/NetworkData';
import { ActivityIndicator } from 'react-native-paper';
import { colorAccent } from '../../utils/colors';
import { MOVIE_DETAIL } from '../../navigators/NavigatorNames';
import PersonVerticalItem from '../person/PersonVerticalItem';
import PersonHorizontalItem from '../person/PersonHorizontaltem';

const CelebritiesHome = () => {
    const [isLoading, setLoading] = useState(true);
    const [popular, setPopular] = useState([]);
    const [trending, setTrending] = useState([]);

    useEffect(() => {
        GET_ALL(
            [
                createUrl(API_PERSON_POPULAR),
                createUrl(API_PERSON_TRENDING)
            ],
            (jsons) => {
                setPopular(jsons[0].results)
                setTrending(jsons[1].results);

                setLoading(false);
            }),
            (error) => {
                console.log(error);
            }
    }, []);

    const onPersonClick = (id) => {
        // navigation.navigate(MOVIE_DETAIL, {
        //     movieId: id
        // });
    }

    if (isLoading) {
        return (
            <View style={[globalStyles.container, styles.container]}>
                <ActivityIndicator size='large' color={colorAccent} />
            </View>
        );
    } else {
        const modifiedPopular = createModifiedList(popular, 2);
        const modifiedTrending = createModifiedList(trending, 4);
        return (
            <ScrollView>
                <View style={[globalStyles.container]}>
                    <SectionHeader
                        title='Popular'
                        showAll={() => { }} />
                    <FlatList
                        style={{ flexGrow: 0 }}
                        showsHorizontalScrollIndicator={false}
                        data={modifiedPopular}
                        horizontal
                        //     keyExtractor={(subList) => subList[0].id}
                        renderItem={({ item }) => PopularMainComponent(item, onPersonClick)}
                    />
                    <SectionHeader
                        title='Trending'
                        showAll={() => { }} />
                    <FlatList
                        style={{ flexGrow: 0, marginBottom: 20 }}
                        showsHorizontalScrollIndicator={false}
                        data={modifiedTrending}
                        horizontal
                        //    keyExtractor={({ id }) => id}
                        renderItem={({ item }) => TrendingMainComponent(item, onPersonClick)}
                    />
                </View>
            </ScrollView>
        );
    }
}

const createModifiedList = (popular, chunk) => {
    const modifiedList = [];
    var i, j, temporary;
    for (i = 0, j = popular.length; i < j; i += chunk) {
        temporary = popular.slice(i, i + chunk);
        modifiedList.push(temporary);
    }
    return modifiedList;
}

const PopularMainComponent = (list, onPersonClick) => {
    return (
        <FlatList
            data={list}
            keyExtractor={({ id }) => id}
            renderItem={({ item }) => getVerticalRenderItem(item, onPersonClick)}
        />
    );
}

const getVerticalRenderItem = (item, onPersonClick) => {
    return <PersonVerticalItem
        id={item.id}
        imageUrl={item['profile_path']}
        title={item['name']}
        description={item['known_for_department']}
        onClick={(id) => {
            onPersonClick(id)
        }}
    />
}

const TrendingMainComponent = (list, onPersonClick) => {
    return (
        <FlatList
            data={list}
            keyExtractor={({ id }) => id}
            renderItem={({ item }) => getHorizontalRenderItem(item, onPersonClick)}
        />
    );
}

const getHorizontalRenderItem = (item, onPersonClick) => {
    return <PersonHorizontalItem
        id={item.id}
        imageUrl={item['profile_path']}
        title={item['name']}
        description={item['known_for_department']}
        onClick={(id) => {
            onPersonClick(id)
        }}
    />
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default CelebritiesHome;