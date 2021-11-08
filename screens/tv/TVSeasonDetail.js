import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, FlatList, SafeAreaView, LogBox } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ActivityIndicator } from 'react-native-paper';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import SectionHeader from '../../components/SectionHeader';
import { createUrl, GET_ALL } from '../../network/Api';
import { API_TV_SEASON_DETAIL, IMAGE_BASE_URL, PARAM_LANGUAGE, PARAM_LANGUAGE_VALUE, VAR_SEASON_NUMBER, VAR_TV_ID } from '../../network/NetworkData';
import { colorAccent, colorAccentDark, colorGrey, colorGreyDark, colorImageBorder, colorPrimary } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import { formatDate, roundNum } from '../../utils/ValueUtils';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TVSeasonDetail = ({ route, navigation }) => {
    const { tvId, tvShowName, seasonNumber } = route.params;

    const [isLoading, setLoading] = useState(true);
    const [seasonDetail, setSeasonDetail] = useState(null);

    useEffect(() => {
        updateParams(navigation, seasonDetail)
    }, [seasonDetail]);

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

        const params = {}
        params[PARAM_LANGUAGE] = PARAM_LANGUAGE_VALUE;
        console.log(createUrl(`${API_TV_SEASON_DETAIL.replace(VAR_TV_ID, tvId).replace(VAR_SEASON_NUMBER, seasonNumber)}`, params))

        GET_ALL(
            [
                createUrl(`${API_TV_SEASON_DETAIL.replace(VAR_TV_ID, tvId).replace(VAR_SEASON_NUMBER, seasonNumber)}`, params),
            ],
            (jsons) => {
                setSeasonDetail(jsons[0]);
                setLoading(false);
            }),
            (error) => {
                console.log(error);
            }
    }, []);

    if (isLoading || seasonDetail === null) {
        return (
            <View style={[globalStyles.container, styles.container]}>
                <ActivityIndicator size='large' color={colorAccent} />
            </View>
        );
    } else {
        return (
            <View style={[{ flex: 1, backgroundColor: colorPrimary, }]}>
                <ScrollView>
                    <View style={[{ flex: 1, backgroundColor: colorPrimary, }]}>
                        <BasicDetailComponent seasonDetail={seasonDetail} tvShowName={tvShowName} />
                        <Divider />
                        {
                            seasonDetail['overview'].length > 0
                                ? <View>
                                    <SectionHeader
                                        title='About this Show'
                                        hideShowAll={true} />
                                    <Text style={[styles.description, {
                                        marginHorizontal: 12,
                                        marginTop: 0, fontSize: 14
                                    }]}>{seasonDetail['overview']}</Text>
                                    <Divider />
                                </View>
                                : null
                        }

                        <EpisodesListComponent episodes={seasonDetail.episodes} />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const updateParams = (navigation, seasonDetail) => {
    if (seasonDetail !== null) {
        navigation.setOptions({ title: seasonDetail['name'] })
    }
}

const BasicDetailComponent = ({ seasonDetail, tvShowName }) => {
    return (
        <View style={styles.basicDetails}>
            <FastImage
                style={styles.posterImage}
                source={{ uri: IMAGE_BASE_URL + seasonDetail['poster_path'] }} />
            <View style={{ marginStart: 10, marginTop: 4, flex: 1, alignSelf: 'stretch' }}>
                <Text style={styles.title}>{tvShowName}</Text>
                <Text style={[styles.description, { fontSize: 14 }]}>{seasonDetail['name']}</Text>
                <Text style={styles.description}>{formatDate(seasonDetail['air_date'])}</Text>
            </View>

        </View>
    );
}

const EpisodesListComponent = ({ episodes }) => {
    if (episodes.length > 0) {
        return (
            <View>
                <SectionHeader
                    title='Episodes'
                    hideShowAll={true} />
                <FlatList
                    style={{ flexGrow: 0 }}
                    data={episodes}
                    keyExtractor={({ id }) => id}
                    renderItem={({ item, index }) => EpisodeComponent(item, index)}
                />
            </View>
        );
    } else {
        return null
    }
}

const Divider = () => {
    return (
        <View style={{ backgroundColor: colorGreyDark, height: 1, marginVertical: 12 }} />
    );
}

const EpisodeComponent = (episode, index) => {
    const epiStyles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            margin: 12,
            flex: 1
        },
        imageContainer: {
            borderWidth: 0.5,
            borderColor: colorImageBorder,
            height: 71
        },
        image: {
            width: 110,
            height: 70
        },
        title: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16
        },
        date: {
            color: 'white',
            fontSize: 13,
        },
        overview: {
            color: colorGrey,
        }
    });

    return (
        <View style={epiStyles.container}>
            <View style={epiStyles.imageContainer}>
                <Icon
                    name='image'
                    color='#B5B5B5'
                    size={44}
                    style={[epiStyles.image, {
                        position: 'absolute',
                        backgroundColor: '#DBDBDB',
                        textAlign: 'center',
                        textAlignVertical: 'center'
                    }]} />
                <FastImage
                    style={epiStyles.image}
                    source={{ uri: IMAGE_BASE_URL + episode['still_path'] }} />
            </View>
            <View style={{ marginHorizontal: 8, flex: 1, alignSelf: 'stretch' }}>

                <Text style={epiStyles.title}>{index + 1}. {episode.name}</Text>
                <View style={{ flexDirection: 'row', marginTop: 2, alignItems: 'center' }}>
                    {
                        episode['air_date'].length > 0
                            ? <Text style={epiStyles.date}>{formatDate(episode['air_date'])}</Text>
                            : null
                    }
                    <StarRatingDisplay
                        rating={roundNum(episode['vote_average'] / 2)}
                        maxStars={5}
                        starSize={16}
                        color={colorAccentDark}
                        starStyle={{
                            marginHorizontal: 0
                        }}
                        style={{ marginStart: 4 }}
                    />
                    <Text style={styles.ratingCount}>( {episode['vote_count']} )</Text>
                </View>
                <Text style={epiStyles.overview}>{episode.overview}</Text>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    posterImage: {
        width: 100,
        height: 150,
    },
    basicDetails: {
        marginHorizontal: 12,
        marginTop: 12,
        flexDirection: 'row',
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        includeFontPadding: false
    },
    ratingCount: {
        color: colorAccentDark,
        fontSize: 12,
        marginStart: 4,
        fontWeight: 'bold',
        includeFontPadding: false
    },
    description: {
        color: colorGrey,
        fontSize: 12,
        marginTop: 8
    },
});

export default TVSeasonDetail;