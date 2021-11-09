import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, FlatList, TouchableWithoutFeedback, Linking } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { ActivityIndicator } from 'react-native-paper';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RoundedImage from '../../components/RoundedImage';
import SectionHeader from '../../components/SectionHeader';
import VerticalItem from '../../components/VerticalItem';
import VideoTileItem from '../../components/VideoTileItem';
import { MOVIES_HOME_STACK, MOVIE_DETAIL, MOVIE_LIST, PERSON_CREDITS, TV_SHOWS_HOME_STACK, TV_SHOW_DETAIL } from '../../navigators/NavigatorNames';
import { createUrl, GET_ALL } from '../../network/Api';
import { API_MOVIES_GENRES, API_MOVIE_DETAIL, API_PERSON_DETAIL, API_PERSON_MOVIES, API_PERSON_TV_SHOWS, API_TV_GENRES, IMAGE_BASE_URL, PARAM_APPEND_TO_RESPONSE, PARAM_LANGUAGE, PARAM_LANGUAGE_VALUE, PARAM_MOVIES_ATR_VALUE, PARAM_PERSON_ATR_VALUE, PARAM_TV_ATR_VALUE, VAR_MOVIE_ID, VAR_PERSON_ID } from '../../network/NetworkData';
import { colorAccent, colorAccentDark, colorGrey, colorGreyDark, colorImageBorder, colorPrimary } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import { convertCurrency, formatDate, roundNum } from '../../utils/ValueUtils';

const PersonDetail = ({ route, navigation }) => {
    const { personId } = route.params;

    const [isLoading, setLoading] = useState(true);
    const [movieGenre, setMovieGenre] = useState([]);
    const [tvGenre, setTvGenre] = useState([]);
    const [personDetail, setPersonDetail] = useState(null);

    useEffect(() => {
        updateParams(navigation, personDetail)
    }, [personDetail]);

    useEffect(() => {
        const params = {}
        params[PARAM_APPEND_TO_RESPONSE] = PARAM_PERSON_ATR_VALUE;
        params[PARAM_LANGUAGE] = PARAM_LANGUAGE_VALUE;
        console.log(createUrl(`${API_PERSON_DETAIL.replace(VAR_PERSON_ID, personId)}`, params))

        GET_ALL(
            [
                createUrl(API_MOVIES_GENRES),
                createUrl(API_TV_GENRES),
                createUrl(`${API_PERSON_DETAIL.replace(VAR_PERSON_ID, personId)}`, params),
            ],
            (jsons) => {
                setMovieGenre(jsons[0].genres)
                setTvGenre(jsons[1].genres)
                setPersonDetail(jsons[2]);
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

    const onTvShowClick = (id) => {
        navigation.push(TV_SHOW_DETAIL, {
            tvId: id
        });
    }

    const onSeeAllMovieClick = () => {
        navigation.push(PERSON_CREDITS, {
            title: 'Movies',
            apiUrl: API_PERSON_MOVIES.replace(VAR_PERSON_ID, personDetail.id),
            genreApiUrl: API_MOVIES_GENRES
        });
    }

    const onSeeAllTvShowClick = () => {
        navigation.push(PERSON_CREDITS, {
            title: 'Tv Shows',
            apiUrl: API_PERSON_TV_SHOWS.replace(VAR_PERSON_ID, personDetail.id),
            genreApiUrl: API_TV_GENRES
        });
    }

    if (isLoading || personDetail === null) {
        return (
            <View style={[globalStyles.container, styles.container]}>
                <ActivityIndicator size='large' color={colorAccent} />
            </View>
        );
    } else {
        return (
            <ScrollView>
                <View style={[{ flex: 1, backgroundColor: colorPrimary, }]}>
                    <BasicDetailComponent personDetail={personDetail} />
                    <Divider />
                    <BiographyComponent personDetail={personDetail} />
                    <Divider />

                    <MoviesComponent
                        genre={movieGenre}
                        movies={personDetail['movie_credits'].cast}
                        onMovieClick={onMovieClick}
                        onSeeAllMovieClick={onSeeAllMovieClick} />
                    <TvShowComponent
                        genre={tvGenre}
                        tvShows={personDetail['tv_credits'].cast}
                        onTvShowClick={onTvShowClick}
                        onSeeAllTvShowClick={onSeeAllTvShowClick} />
                </View>
            </ScrollView>
        );
    }
}

const updateParams = (navigation, personDetail) => {
    if (personDetail !== null) {
        navigation.setOptions({ title: personDetail['name'] })
    }
}

const BasicDetailComponent = ({ personDetail }) => {
    return (
        <View style={[styles.basicDetails, { marginHorizontal: 12, marginTop: 12 }]}>
            <View style={styles.profileImageContainer}>
                <Icon
                    name='person'
                    color='#B5B5B5'
                    size={44}
                    style={[styles.profileImage, {
                        position: 'absolute',
                        backgroundColor: '#DBDBDB',
                        textAlign: 'center',
                        textAlignVertical: 'center'
                    }]} />
                <FastImage
                    style={styles.profileImage}
                    source={{ uri: IMAGE_BASE_URL + personDetail['profile_path'] }} />
            </View>

            <View style={{ marginStart: 10, marginTop: 10, flex: 1, alignSelf: 'stretch' }}>
                <Text style={styles.title}>{personDetail['name']}</Text>
                <Text style={styles.descriptionTitle}>Known for</Text>
                <Text style={styles.description}>{personDetail['known_for_department']}</Text>
                <Text style={styles.descriptionTitle}>Birthplace</Text>
                <Text style={styles.description}>{personDetail['place_of_birth']}</Text>
                <Text style={styles.descriptionTitle}>Date of Birth</Text>
                <Text style={styles.description}>{formatDate(personDetail['birthday'])}</Text>
            </View>

        </View>
    );
}

const BiographyComponent = ({ personDetail }) => {
    return (
        <View style={{ marginHorizontal: 12, }}>
            <Text style={styles.title}>Biography</Text>
            <Text style={styles.biography}>{personDetail['biography']}</Text>
        </View>
    );
}

const MoviesComponent = ({ genre, movies, onMovieClick, onSeeAllMovieClick }) => {
    if (movies.length > 0) {
        return (
            <View>
                <SectionHeader
                    title='Movies'
                    showAll={() => { onSeeAllMovieClick() }} />
                <FlatList
                    style={{ flexGrow: 0 }}
                    showsHorizontalScrollIndicator={false}
                    data={movies.slice(0, 20)}
                    horizontal
                    keyExtractor={({ id }) => id}
                    renderItem={({ item }) => getVerticalRenderMovieItem(item, genre, onMovieClick)}
                />
                <Divider />
            </View>
        );
    } else {
        return null
    }
}

const TvShowComponent = ({ genre, tvShows, onTvShowClick, onSeeAllTvShowClick }) => {
    if (tvShows.length > 0) {
        return (
            <View>
                <SectionHeader
                    title='Tv Shows'
                    showAll={() => { onSeeAllTvShowClick() }} />
                <FlatList
                    style={{ flexGrow: 0 }}
                    showsHorizontalScrollIndicator={false}
                    data={tvShows.slice(0, 20)}
                    horizontal
                    keyExtractor={(item) => item['credit_id']}
                    renderItem={({ item }) => getVerticalRenderTvItem(item, genre, onTvShowClick)}
                />
                <Divider />
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

const getVerticalRenderMovieItem = (item, genre, onMovieClick) => {
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

const getVerticalRenderTvItem = (item, genre, onTvShowClick) => {
    const genreNamesList = genre.filter(it => item['genre_ids'].includes(it.id)).map(it => it.name).join(", ")
    return <VerticalItem
        id={item.id}
        imageUrl={item['poster_path']}
        title={item['name']}
        description={genreNamesList}
        onClick={(id) => {
            onTvShowClick(id)
        }}
    />
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileImageContainer: {
        borderWidth: 1,
        borderColor: colorImageBorder,
        borderRadius: 16,
    },
    profileImage: {
        width: 140,
        height: 200,
        borderRadius: 16
    },
    basicDetails: {
        paddingTop: 4,
        flexDirection: 'row',
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        includeFontPadding: false
    },
    description: {
        color: colorGrey,
        fontSize: 16,
        includeFontPadding: false
    },
    biography: {
        color: colorGrey,
        fontSize: 13,
        includeFontPadding: false,
        marginTop: 10
    },
    descriptionTitle: {
        color: 'white',
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

export default PersonDetail;