import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, FlatList, TouchableWithoutFeedback, Linking } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { ActivityIndicator } from 'react-native-paper';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import RoundedImage from '../../components/RoundedImage';
import SectionHeader from '../../components/SectionHeader';
import VerticalItem from '../../components/VerticalItem';
import VideoTileItem from '../../components/VideoTileItem';
import { TV_SHOW_DETAIL } from '../../navigators/NavigatorNames';
import { createUrl, GET_ALL } from '../../network/Api';
import { API_TV_DETAIL, API_TV_GENRES, IMAGE_BASE_URL, PARAM_APPEND_TO_RESPONSE, PARAM_LANGUAGE, PARAM_LANGUAGE_VALUE, PARAM_TV_ATR_VALUE, VAR_TV_ID } from '../../network/NetworkData';
import { colorAccent, colorAccentDark, colorGrey, colorGreyDark, colorImageBorder, colorPrimary } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import { convertCurrency, formatDate, roundNum } from '../../utils/ValueUtils';

const TVShowDetail = ({ route, navigation }) => {
    const { tvId } = route.params;

    const [isLoading, setLoading] = useState(true);
    const [genre, setGenre] = useState([]);
    const [tvShowDetail, setTvShowDetail] = useState(null);

    useEffect(() => {
        updateParams(navigation, tvShowDetail)
    }, [tvShowDetail]);

    useEffect(() => {
        const params = {}
        params[PARAM_APPEND_TO_RESPONSE] = PARAM_TV_ATR_VALUE;
        params[PARAM_LANGUAGE] = PARAM_LANGUAGE_VALUE;
        console.log(createUrl(`${API_TV_DETAIL.replace(VAR_TV_ID, tvId)}`, params))

        GET_ALL(
            [
                createUrl(API_TV_GENRES),
                createUrl(`${API_TV_DETAIL.replace(VAR_TV_ID, tvId)}`, params),
            ],
            (jsons) => {
                setGenre(jsons[0].genres)
                setTvShowDetail(jsons[1]);
                setLoading(false);
            }),
            (error) => {
                console.log(error);
            }
    }, []);

    const onTVShowClick = (id) => {
        navigation.push(TV_SHOW_DETAIL, {
            tvId: id
        });
    }

    if (isLoading || tvShowDetail === null) {
        return (
            <View style={[globalStyles.container, styles.container]}>
                <ActivityIndicator size='large' color={colorAccent} />
            </View>
        );
    } else {
        return (
            <ScrollView>
                <View style={[{ flex: 1, backgroundColor: colorPrimary, }]}>
                    <FastImage
                        style={styles.bannerImage}
                        source={{ uri: IMAGE_BASE_URL + tvShowDetail['backdrop_path'] }} />
                    <LinearGradient colors={['#FFFFFF00', '#FFFFFF00', '#000000']} style={{
                        position: 'absolute', width: '100%',
                        height: 210
                    }} />
                    <BasicDetailComponent tvShowDetail={tvShowDetail} />
                    <Divider />
                    <SeasonsComponent
                        seasons={tvShowDetail.seasons}
                        genres={tvShowDetail['genres']} />
                    <CastListComponent casts={tvShowDetail.credits.cast} />
                    <VideosComponent videos={tvShowDetail.videos.results} />
                    <InformationComponent tvShowDetail={tvShowDetail} />
                    <Divider />
                    <RecommendedComponent
                        genre={genre}
                        recommended={tvShowDetail.recommendations.results}
                        onTVShowClick={onTVShowClick} />
                    <SimilarComponent
                        genre={genre}
                        similar={tvShowDetail.similar.results}
                        onTVShowClick={onTVShowClick} />
                </View>
            </ScrollView>
        );
    }
}

const updateParams = (navigation, tvShowDetail) => {
    if (tvShowDetail !== null) {
        navigation.setOptions({ title: tvShowDetail['name'] })
    }
}

const BasicDetailComponent = ({ tvShowDetail }) => {
    return (
        <View style={styles.basicDetails}>
            <FastImage
                style={styles.posterImage}
                source={{ uri: IMAGE_BASE_URL + tvShowDetail['poster_path'] }} />

            <View style={{ marginStart: 10, flex: 1, alignSelf: 'stretch' }}>
                <Text style={styles.title}>{tvShowDetail['name']}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <StarRatingDisplay
                        rating={roundNum(tvShowDetail['vote_average'] / 2)}
                        maxStars={5}
                        starSize={16}
                        color={colorAccentDark}
                        starStyle={{
                            marginHorizontal: 0
                        }}
                    />
                    <Text style={styles.ratingCount}>( {tvShowDetail['vote_count']} )</Text>

                    <StarRatingDisplay
                        rating={1}
                        maxStars={1}
                        starSize={16}
                        color={colorAccentDark}
                        starStyle={{
                            marginHorizontal: 0
                        }}
                        style={{ marginStart: 16 }}
                    />
                    <Text style={[styles.ratingCount, { fontSize: 14 }]}>{tvShowDetail['vote_average']}</Text>
                </View>
                <FlatList
                    style={{ flexGrow: 0, marginTop: 8 }}
                    showsHorizontalScrollIndicator={false}
                    data={tvShowDetail['genres']}
                    horizontal
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => {
                        return (
                            <Text style={styles.genreText}>{item.name}</Text>
                        )
                    }}
                />
                <Text style={styles.description}>{tvShowDetail['overview']}</Text>
            </View>

        </View>
    );
}

const SeasonsComponent = ({ seasons }) => {
    if (seasons != null && seasons.length > 0) {
        return (
            <View>
                <TouchableWithoutFeedback
                    onPress={() => {
                        // TODO: Navigate to Seasons List Page
                    }}>
                    <View>
                        <SectionHeader
                            title='Seasons'
                            showAll={() => { }} />
                        <FlatList
                            style={{ flexGrow: 0, marginTop: 4 }}
                            showsHorizontalScrollIndicator={false}
                            data={seasons}
                            horizontal
                            keyExtractor={({ id }) => id}
                            renderItem={({ item }) => {
                                return (
                                    <VerticalItem
                                        id={item.id}
                                        imageUrl={item['poster_path']}
                                        title={item['name']}
                                        onClick={(id) => {
                                            onTVShowClick(id)
                                        }}
                                    />);
                            }}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <Divider />
            </View>
        );
    } else {
        return null
    }
}

const InformationComponent = ({ tvShowDetail }) => {
    const informationStyles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            marginTop: 2,
        },
        header: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16,
        },
        title: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 14,
            marginEnd: 4,
            flex: 1,
            textAlign: 'right'
        },
        detail: {
            color: colorGrey,
            fontWeight: 'bold',
            fontSize: 14,
            marginStart: 4,
            flex: 1
        }
    });
    const languageNames = tvShowDetail['spoken_languages'].map(it => it['english_name']).join(", ");
    const countryNames = tvShowDetail['origin_country'].join(", ");
    const networkNames = tvShowDetail['networks'].map(it => it['name']).join("\n");
    const productionCompaniesNames = tvShowDetail['production_companies'].map(it => it['name']).join("\n");
    const createdByNames = tvShowDetail['created_by'].map(it => it['name']).join("\n");

    return (
        <View style={{ marginHorizontal: 8 }}>
            <Text style={informationStyles.header}>Information</Text>
            {
                tvShowDetail['created_by'] !== null && tvShowDetail['created_by'].length > 0
                    ? <View style={informationStyles.container}>
                        <Text style={informationStyles.title}>Created by</Text>
                        <Text style={informationStyles.detail}>{createdByNames}</Text>
                    </View>
                    : null
            }
            {
                tvShowDetail['first_air_date'] !== null
                    ? <View style={informationStyles.container}>
                        <Text style={informationStyles.title}>First Air Date</Text>
                        <Text style={informationStyles.detail}>{formatDate(tvShowDetail['first_air_date'])}</Text>
                    </View>
                    : null
            }
            {
                tvShowDetail['spoken_languages'] !== null && tvShowDetail['spoken_languages'].length > 0
                    ? <View style={informationStyles.container}>
                        <Text style={informationStyles.title}>Languages</Text>
                        <Text style={informationStyles.detail}>{languageNames}</Text>
                    </View>
                    : null
            }
            {
                tvShowDetail['origin_country'] !== null && tvShowDetail['origin_country'].length > 0
                    ? <View style={informationStyles.container}>
                        <Text style={informationStyles.title}>Country of Origin</Text>
                        <Text style={informationStyles.detail}>{countryNames}</Text>
                    </View>
                    : null
            }
            {
                tvShowDetail['networks'] !== null && tvShowDetail['networks'].length > 0
                    ? <View style={informationStyles.container}>
                        <Text style={informationStyles.title}>Networks</Text>
                        <Text style={informationStyles.detail}>{networkNames}</Text>
                    </View>
                    : null
            }
            {
                tvShowDetail['production_companies'] !== null && tvShowDetail['production_companies'].length > 0
                    ? <View style={informationStyles.container}>
                        <Text style={informationStyles.title}>Production Companies</Text>
                        <Text style={informationStyles.detail}>{productionCompaniesNames}</Text>
                    </View>
                    : null
            }
        </View>
    );
}

const CastListComponent = ({ casts }) => {
    if (casts.length > 0) {
        return (
            <View>
                <SectionHeader
                    title='Cast & Crew'
                    showAll={() => { }} />
                <FlatList
                    style={{ flexGrow: 0, marginTop: 4 }}
                    showsHorizontalScrollIndicator={false}
                    data={casts.slice(0, 15)}
                    horizontal
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => <CastComponent item={item} onClick={() => { }} />}
                />
                <Divider />
            </View>
        );
    } else {
        return null
    }
}

const CastComponent = ({ item, onClick }) => {
    const size = 90;
    const castStyles = StyleSheet.create({
        container: {
            marginStart: 12,
            marginEnd: 4
        },
        title: {
            fontSize: 13,
            color: 'white',
            fontWeight: 'bold',
            marginTop: 8,
            width: size + 16,
            textAlign: 'center'
        },
        description: {
            fontSize: 12,
            color: colorGrey,
            marginBottom: 12,
            width: size + 10,
            textAlign: 'center'
        }
    });
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                onClick(item.id);
            }}>
            <View style={castStyles.container}>
                <RoundedImage imageUrl={IMAGE_BASE_URL + item['profile_path']} size={size} />
                <Text style={castStyles.title} numberOfLines={1}>{item.name}</Text>
                <Text style={castStyles.description} numberOfLines={1}>{item.character}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}

const VideosComponent = ({ videos }) => {
    if (videos.length > 0) {
        return (
            <View>
                <SectionHeader
                    title='Videos'
                    hideShowAll={true}
                    showAll={() => { }} />
                <FlatList
                    style={{ flexGrow: 0, marginTop: 4 }}
                    showsHorizontalScrollIndicator={false}
                    data={videos}
                    horizontal
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => {
                        return <VideoTileItem
                            item={item}
                            onClick={key => {
                                const url = 'https://www.youtube.com/watch?v=' + key;
                                Linking.openURL(url);
                            }} />
                    }}
                />
                <Divider />
            </View>
        );
    } else {
        return null
    }
}

const RecommendedComponent = ({ genre, recommended, onTVShowClick }) => {
    if (recommended.length > 0) {
        return (
            <View>
                <SectionHeader
                    title='Recommended'
                    showAll={() => { }} />
                <FlatList
                    style={{ flexGrow: 0 }}
                    showsHorizontalScrollIndicator={false}
                    data={recommended}
                    horizontal
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => getVerticalRenderItem(item, genre, onTVShowClick)}
                />
                <Divider />
            </View>
        );
    } else {
        return null
    }
}

const SimilarComponent = ({ genre, similar, onTVShowClick }) => {
    if (similar.length > 0) {
        return (
            <View>
                <SectionHeader
                    title='Similar'
                    showAll={() => { }} />
                <FlatList
                    style={{ flexGrow: 0 }}
                    showsHorizontalScrollIndicator={false}
                    data={similar}
                    horizontal
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => getVerticalRenderItem(item, genre, onTVShowClick)}
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

const getVerticalRenderItem = (item, genre, onTVShowClick) => {
    const genreNamesList = genre.filter(it => item['genre_ids'].includes(it.id)).map(it => it.name).join(", ")
    return <VerticalItem
        id={item.id}
        imageUrl={item['poster_path']}
        title={item['name']}
        description={genreNamesList}
        onClick={(id) => {
            onTVShowClick(id)
        }}
    />
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    bannerImage: {
        width: '100%',
        height: 210
    },
    posterImage: {
        width: 100,
        height: 150,
    },
    basicDetails: {
        marginHorizontal: 6,
        flexDirection: 'row',
        marginTop: -10
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
        includeFontPadding: false
    },
    description: {
        color: colorGrey,
        fontSize: 12,
        marginTop: 8
    },
    genreText: {
        color: colorGrey,
        fontSize: 12,
        padding: 6,
        borderColor: colorGrey,
        borderWidth: 1,
        marginEnd: 8,
    }
});

export default TVShowDetail;