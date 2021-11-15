import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, FlatList, TouchableWithoutFeedback, Linking, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { ActivityIndicator } from 'react-native-paper';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RoundedImage from '../../components/RoundedImage';
import SectionHeader from '../../components/SectionHeader';
import VerticalItem from '../../components/VerticalItem';
import VideoTileItem from '../../components/VideoTileItem';
import { GENRE_LIST, MOVIE_COLLECTION_DETAIL, MOVIE_CREDITS, MOVIE_DETAIL, MOVIE_LIST, PERSON_DETAIL } from '../../navigators/NavigatorNames';
import { createUrl, GET_ALL } from '../../network/Api';
import { API_MOVIES_GENRES, API_MOVIE_DETAIL, API_MOVIE_RECOMMENDATIONS, API_MOVIE_SIMILAR, IMAGE_BASE_URL, PARAM_APPEND_TO_RESPONSE, PARAM_LANGUAGE, PARAM_LANGUAGE_VALUE, PARAM_MOVIES_ATR_VALUE, VAR_MOVIE_ID } from '../../network/NetworkData';
import { colorAccent, colorAccentDark, colorGrey, colorGreyDark, colorImageBorder, colorPrimary } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import { convertCurrency, formatDate, roundNum } from '../../utils/ValueUtils';

const MovieDetail = ({ route, navigation }) => {
    const { movieId } = route.params;

    const [isLoading, setLoading] = useState(true);
    const [genre, setGenre] = useState([]);
    const [movieDetail, setMovieDetail] = useState(null);

    useEffect(() => {
        updateParams(navigation, movieDetail)
    }, [movieDetail]);

    useEffect(() => {
        const params = {}
        params[PARAM_APPEND_TO_RESPONSE] = PARAM_MOVIES_ATR_VALUE;
        params[PARAM_LANGUAGE] = PARAM_LANGUAGE_VALUE;
        console.log(createUrl(`${API_MOVIE_DETAIL.replace(VAR_MOVIE_ID, movieId)}`, params))

        GET_ALL(
            [
                createUrl(API_MOVIES_GENRES),
                createUrl(`${API_MOVIE_DETAIL.replace(VAR_MOVIE_ID, movieId)}`, params),
            ],
            (jsons) => {
                setGenre(jsons[0].genres)
                setMovieDetail(jsons[1]);
                setLoading(false);
            }),
            (error) => {
                console.log(error);
            }
    }, []);

    const onMovieClick = (id) => {
        navigation.push(MOVIE_DETAIL, {
            movieId: id
        });
    }

    const onCollectionClick = (id) => {
        navigation.push(MOVIE_COLLECTION_DETAIL, {
            collectionId: id
        });
    }

    const onPersonClick = (id) => {
        navigation.push(PERSON_DETAIL, {
            personId: id
        });
    }

    const onSeeAllClick = (title, apiUrl) => {
        navigation.push(MOVIE_LIST, {
            title: title,
            apiUrl: apiUrl.replace(VAR_MOVIE_ID, movieId)
        });
    }

    const onSeeAllCreditsClick = () => {
        navigation.push(MOVIE_CREDITS, {
            movieId: movieId
        });
    }

    const onGenreClick = (genre) => {
        navigation.push(GENRE_LIST, {
            genreId: genre.id,
            genreName: genre.name
        });
    }

    if (isLoading || movieDetail === null) {
        return (
            <View style={[globalStyles.container, styles.container]}>
                <ActivityIndicator size='large' color={colorAccent} />
            </View>
        );
    } else {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[{ flex: 1, backgroundColor: colorPrimary, }]}>
                    <FastImage
                        style={styles.bannerImage}
                        source={{ uri: IMAGE_BASE_URL + movieDetail['backdrop_path'] }} />
                    <LinearGradient colors={['#FFFFFF00', '#FFFFFF00', '#000000']} style={{
                        position: 'absolute', width: '100%',
                        height: 210
                    }} />
                    <BasicDetailComponent movieDetail={movieDetail} onGenreClick={onGenreClick} />
                    <Divider />
                    <CollectionComponent
                        collection={movieDetail['belongs_to_collection']}
                        genres={movieDetail['genres']}
                        onCollectionClick={onCollectionClick} />
                    <CastListComponent
                        casts={movieDetail.credits.cast}
                        onPersonClick={onPersonClick}
                        onSeeAllCreditsClick={onSeeAllCreditsClick} />
                    <VideosComponent videos={movieDetail.videos.results} />
                    <InformationComponent movieDetail={movieDetail} />
                    <Divider />
                    <RecommendedComponent
                        genre={genre}
                        recommended={movieDetail.recommendations.results}
                        onMovieClick={onMovieClick}
                        onSeeAllClick={onSeeAllClick} />
                    <SimilarComponent
                        genre={genre}
                        similar={movieDetail.similar.results}
                        onMovieClick={onMovieClick}
                        onSeeAllClick={onSeeAllClick} />
                </View>
            </ScrollView>
        );
    }
}

const updateParams = (navigation, movieDetail) => {
    if (movieDetail !== null) {
        navigation.setOptions({ title: movieDetail['title'] })
    }
}

const BasicDetailComponent = ({ movieDetail, onGenreClick }) => {
    return (
        <View style={styles.basicDetails}>
            <FastImage
                style={styles.posterImage}
                source={{ uri: IMAGE_BASE_URL + movieDetail['poster_path'] }} />

            <View style={{ marginStart: 10, flex: 1, alignSelf: 'stretch' }}>
                <Text style={styles.title}>{movieDetail['title']}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <StarRatingDisplay
                        rating={roundNum(movieDetail['vote_average'] / 2)}
                        maxStars={5}
                        starSize={16}
                        color={colorAccentDark}
                        starStyle={{
                            marginHorizontal: 0
                        }}
                    />
                    <Text style={styles.ratingCount}>( {movieDetail['vote_count']} )</Text>

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
                    <Text style={[styles.ratingCount, { fontSize: 14 }]}>{movieDetail['vote_average']}</Text>
                </View>
                <FlatList
                    style={{ flexGrow: 0, marginTop: 8 }}
                    showsHorizontalScrollIndicator={false}
                    data={movieDetail['genres']}
                    horizontal
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => onGenreClick(item)}>
                                <Text style={styles.genreText}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
                <Text style={styles.description}>{movieDetail['overview']}</Text>
            </View>

        </View>
    );
}

const CollectionComponent = ({ collection, genres, onCollectionClick }) => {
    if (collection != null) {
        const genresNames = genres.map(it => it.name).join(", ");
        return (
            <View>
                <TouchableWithoutFeedback
                    onPress={() => {
                        onCollectionClick(collection.id)
                    }}>
                    <View style={{ marginHorizontal: 8 }}>
                        <Text style={styles.title}>Collection</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ alignSelf: 'flex-start', borderWidth: 0.5, borderColor: colorImageBorder, marginTop: 12 }}>
                                <FastImage
                                    style={{ width: 100, height: 130, }}
                                    source={{ uri: IMAGE_BASE_URL + collection['poster_path'] }} />
                            </View>
                            <View style={{ marginStart: 8, flex: 1 }}>
                                <Text
                                    style={[styles.title, { fontSize: 13, }]}
                                >
                                    {collection['name']}
                                </Text>
                                <Text
                                    style={{ fontSize: 12, color: colorGrey, marginTop: 2 }}
                                >
                                    {genresNames}
                                </Text>
                            </View>
                            <Icon name='keyboard-arrow-right' size={32} color={colorGrey} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <Divider />
            </View>
        );
    } else {
        return null
    }
}

const InformationComponent = ({ movieDetail }) => {
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
    const languageNames = movieDetail['spoken_languages'].map(it => it['english_name']).join(", ");
    const productionCompaniesNames = movieDetail['production_companies'].map(it => it['name']).join("\n");

    return (
        <View style={{ marginHorizontal: 8 }}>
            <Text style={informationStyles.header}>Information</Text>
            {
                movieDetail['release_date'] !== null
                    ? <View style={informationStyles.container}>
                        <Text style={informationStyles.title}>Release Date</Text>
                        <Text style={informationStyles.detail}>{formatDate(movieDetail['release_date'])}</Text>
                    </View>
                    : null
            }
            {
                movieDetail['spoken_languages'] !== null && movieDetail['spoken_languages'].length > 0
                    ? <View style={informationStyles.container}>
                        <Text style={informationStyles.title}>Languages</Text>
                        <Text style={informationStyles.detail}>{languageNames}</Text>
                    </View>
                    : null
            }
            {
                movieDetail['budget'] !== null && movieDetail['budget'] > 0
                    ? <View style={informationStyles.container}>
                        <Text style={informationStyles.title}>Budget</Text>
                        <Text style={informationStyles.detail}>{convertCurrency(movieDetail['budget'])}</Text>
                    </View>
                    : null
            }
            {
                movieDetail['revenue'] !== null && movieDetail['revenue'] > 0
                    ? <View style={informationStyles.container}>
                        <Text style={informationStyles.title}>Revenue</Text>
                        <Text style={informationStyles.detail}>{convertCurrency(movieDetail['revenue'])}</Text>
                    </View>
                    : null
            }
            {
                movieDetail['production_companies'] !== null && movieDetail['production_companies'].length > 0
                    ? <View style={informationStyles.container}>
                        <Text style={informationStyles.title}>Production Companies</Text>
                        <Text style={informationStyles.detail}>{productionCompaniesNames}</Text>
                    </View>
                    : null
            }
        </View>
    );
}

const CastListComponent = ({ casts, onPersonClick, onSeeAllCreditsClick }) => {
    if (casts.length > 0) {
        return (
            <View>
                <SectionHeader
                    title='Cast & Crew'
                    showAll={() => { onSeeAllCreditsClick() }} />
                <FlatList
                    style={{ flexGrow: 0, marginTop: 4 }}
                    showsHorizontalScrollIndicator={false}
                    data={casts.slice(0, 15)}
                    horizontal
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => <CastComponent item={item} onPersonClick={onPersonClick} />}
                />
                <Divider />
            </View>
        );
    } else {
        return null
    }
}

const CastComponent = ({ item, onPersonClick }) => {
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
                onPersonClick(item.id);
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

const RecommendedComponent = ({ genre, recommended, onMovieClick, onSeeAllClick }) => {
    if (recommended.length > 0) {
        return (
            <View>
                <SectionHeader
                    title='Recommended'
                    showAll={() => { onSeeAllClick('Recommended', API_MOVIE_RECOMMENDATIONS) }} />
                <FlatList
                    style={{ flexGrow: 0 }}
                    showsHorizontalScrollIndicator={false}
                    data={recommended}
                    horizontal
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => getVerticalRenderItem(item, genre, onMovieClick)}
                />
                <Divider />
            </View>
        );
    } else {
        return null
    }
}

const SimilarComponent = ({ genre, similar, onMovieClick, onSeeAllClick }) => {
    if (similar.length > 0) {
        return (
            <View>
                <SectionHeader
                    title='Similar'
                    showAll={() => { onSeeAllClick('Similar', API_MOVIE_SIMILAR) }} />
                <FlatList
                    style={{ flexGrow: 0 }}
                    showsHorizontalScrollIndicator={false}
                    data={similar}
                    horizontal
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => getVerticalRenderItem(item, genre, onMovieClick)}
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

const getVerticalRenderItem = (item, genre, onMovieClick) => {
    const genreNamesList = genre.filter(it => item['genre_ids'].includes(it.id)).map(it => it.name).join(", ")
    return <VerticalItem
        id={item.id}
        imageUrl={item['poster_path']}
        title={item['title']}
        description={genreNamesList}
        onClick={(id) => {
            onMovieClick(id)
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
        //   backgroundColor: 'red'
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

export default MovieDetail;