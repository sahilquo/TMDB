import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { TabBar, TabView } from 'react-native-tab-view';
import { PERSON_DETAIL } from '../../navigators/NavigatorNames';
import { createUrl, GET_ALL } from '../../network/Api';
import { API_TV_CREDITS, PARAM_LANGUAGE, PARAM_LANGUAGE_VALUE, VAR_TV_ID } from '../../network/NetworkData';
import { colorAccent, colorPrimary, colorPrimaryDark } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import { distinctArray } from '../../utils/ValueUtils';
import PersonListItem from '../person/PersonListItem';

const TvShowCredits = ({ route, navigation }) => {
    const { tvId } = route.params;

    const [isLoading, setLoading] = useState(true);
    const [tvShowCasts, setTvShowCasts] = useState([]);
    const [tvShowCrews, setTvShowCrews] = useState([]);

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'cast', title: 'Cast' },
        { key: 'crew', title: 'Crew' },
    ])

    useEffect(() => {
        const params = {}
        params[PARAM_LANGUAGE] = PARAM_LANGUAGE_VALUE;
        console.log(createUrl(API_TV_CREDITS.replace(VAR_TV_ID, tvId), params))

        GET_ALL(
            [
                createUrl(API_TV_CREDITS.replace(VAR_TV_ID, tvId), params),
            ],
            (jsons) => {
                setTvShowCasts(distinctArray(jsons[0].cast, 'id'));
                setTvShowCrews(distinctArray(jsons[0].crew, 'id'));
                setLoading(false);
            }),
            (error) => {
                console.log(error);
            }
    }, []);

    const onPersonClick = (id) => {
        navigation.push(PERSON_DETAIL, {
            personId: id
        });
    }

    if (isLoading || (tvShowCasts === null && tvShowCrews === null)) {
        return (
            <View style={[globalStyles.container, styles.container]}>
                <ActivityIndicator size='large' color={colorAccent} />
            </View>
        );
    } else {
        if (tvShowCasts.length > 0 && tvShowCrews.length > 0) {
            const renderScene = ({ route }) => {
                switch (route.key) {
                    case 'cast':
                        return <ListComponent list={tvShowCasts} onPersonClick={onPersonClick} />;
                    case 'crew':
                        return <ListComponent list={tvShowCrews} onPersonClick={onPersonClick} />;
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
            const list = tvShowCasts.length > 0 ? tvShowCasts : tvShowCrews;
            return (
                <View style={[{ flex: 1, backgroundColor: colorPrimary, }]}>
                    <ListComponent list={list} onPersonClick={onPersonClick} />
                </View>
            );
        }
    }
}

const ListComponent = ({ list, onPersonClick }) => {
    return (
        <FlatList
            data={list}
            keyExtractor={({ id }) => id}
            renderItem={({ item }) => getVerticalRenderItem(item, onPersonClick)}
        />
    );
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
    tabbar: {
        backgroundColor: colorPrimary
    }
});

export default TvShowCredits;