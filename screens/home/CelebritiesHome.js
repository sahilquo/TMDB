import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import SectionHeader from '../../components/SectionHeader';
import { globalStyles } from '../../utils/globalStyles';
import { createUrl, GET_ALL } from '../../network/Api';
import { API_PERSON_POPULAR, API_PERSON_TRENDING, PARAM_REGION, PARAM_REGION_VALUE, PARAM_LANGUAGE, PARAM_LANGUAGE_VALUE } from '../../network/NetworkData';
import { ActivityIndicator } from 'react-native-paper';
import { colorAccent } from '../../utils/colors';
import { ALL_SCREENS, PERSON_DETAIL, PERSON_LIST } from '../../navigators/NavigatorNames';
import PersonVerticalItem from '../person/PersonVerticalItem';
import PersonHorizontalItem from '../person/PersonHorizontaltem';

const CelebritiesHome = ({ navigation }) => {
    const [isLoading, setLoading] = useState(true);
    const [popular, setPopular] = useState([]);
    const [trending, setTrending] = useState([]);

    useEffect(() => {
        const params = {}
        params[PARAM_LANGUAGE] = PARAM_LANGUAGE_VALUE;
        params[PARAM_REGION] = PARAM_REGION_VALUE;
        console.log(createUrl(API_PERSON_POPULAR, params))

        GET_ALL(
            [
                createUrl(API_PERSON_POPULAR, params),
                createUrl(API_PERSON_TRENDING, params)
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
        navigation.push(ALL_SCREENS, {
            screen: PERSON_DETAIL,
            params: {
                personId: id
            }
        })
    }

    const onSeeAllClick = (title, apiUrl) => {
        navigation.push(ALL_SCREENS, {
            screen: PERSON_LIST,
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
        const modifiedPopular = createModifiedList(popular, 2);
        const modifiedTrending = createModifiedList(trending, 4);
        return (
            <ScrollView>
                <View style={[globalStyles.container]}>
                    <SectionHeader
                        title='Popular'
                        showAll={() => { onSeeAllClick('Popular', API_PERSON_POPULAR) }} />
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
                        showAll={() => { onSeeAllClick('Trending', API_PERSON_TRENDING) }} />
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