import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { MOVIE_DETAIL, PERSON_DETAIL } from '../../navigators/NavigatorNames';
import { createUrl, GET, GET_ALL } from '../../network/Api';
import { API_MOVIES_GENRES, PARAM_LANGUAGE, PARAM_LANGUAGE_VALUE, PARAM_PAGE } from '../../network/NetworkData';
import { colorAccent, colorPrimary } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import PersonListItem from './PersonListItem';

const PersonList = ({ route, navigation }) => {
    const { title, apiUrl } = route.params;

    const [isLoading, setLoading] = useState(true);
    const [personList, setPersonList] = useState([]);
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
                    createUrl(apiUrl, params),
                ],
                (jsons) => {
                    setPersonList(jsons[0].results);
                    setTotalPage(jsons[0]['total_pages']);
                    setLoading(false);
                }),
                (error) => {
                    console.log(error);
                }

        } else {
            GET(
                createUrl(apiUrl, params),
                (json) => {
                    const array = [...personList, ...json.results]
                    setPersonList(array.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i));
                    setTotalPage(json['total_pages']);
                    setpaginationRunning(false);
                }),
                (error) => {
                    console.log(error);
                }

        }
    }, [currentPage]);

    const onPersonClick = (id) => {
        navigation.push(PERSON_DETAIL, {
            personId: id
        });
    }

    if (isLoading || personList === null) {
        return (
            <View style={[globalStyles.container, styles.container]}>
                <ActivityIndicator size='large' color={colorAccent} />
            </View>
        );
    } else {
        return (
            <View style={[{ flex: 1, backgroundColor: colorPrimary, }]}>

                <FlatList
                    data={personList}
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => getVerticalRenderItem(item, onPersonClick)}
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

const getVerticalRenderItem = (item, onPersonClick) => {
    return <PersonListItem
        item={item}
        onClick={(id) => {
            onPersonClick(id)
        }}
    />
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default PersonList;