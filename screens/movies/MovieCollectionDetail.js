import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, FlatList, LogBox } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { ActivityIndicator } from 'react-native-paper';
import SectionHeader from '../../components/SectionHeader';
import { MOVIE_DETAIL } from '../../navigators/NavigatorNames';
import { createUrl, GET_ALL } from '../../network/Api';
import { API_MOVIES_GENRES, API_MOVIE_COLLECTION_DETAIL, IMAGE_BASE_URL, PARAM_LANGUAGE, PARAM_LANGUAGE_VALUE, VAR_COLLECTION_ID } from '../../network/NetworkData';
import { colorAccent, colorAccentDark, colorGrey, colorGreyDark, colorPrimary } from '../../utils/colors';
import { globalStyles } from '../../utils/globalStyles';
import MovieListItem from './MovieListItem';

const MovieCollectionDetail = ({ route, navigation }) => {
    const { collectionId } = route.params;

    const [isLoading, setLoading] = useState(true);
    const [genre, setGenre] = useState([]);
    const [collectionDetail, setCollectionDetail] = useState(null);

    useEffect(() => {
        updateParams(navigation, collectionDetail)
    }, [collectionDetail]);

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

        const params = {}
        params[PARAM_LANGUAGE] = PARAM_LANGUAGE_VALUE;
        console.log(createUrl(`${API_MOVIE_COLLECTION_DETAIL.replace(VAR_COLLECTION_ID, collectionId)}`, params))

        GET_ALL(
            [
                createUrl(API_MOVIES_GENRES),
                createUrl(`${API_MOVIE_COLLECTION_DETAIL.replace(VAR_COLLECTION_ID, collectionId)}`, params),
            ],
            (jsons) => {
                setGenre(jsons[0].genres)
                setCollectionDetail(jsons[1]);
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

    if (isLoading || collectionDetail === null) {
        return (
            <View style={[globalStyles.container, styles.container]}>
                <ActivityIndicator size='large' color={colorAccent} />
            </View>
        );
    } else {
        return (
            <View style={[{ flex: 1, backgroundColor: colorPrimary, }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={[{ flex: 1, backgroundColor: colorPrimary, }]}>
                        <FastImage
                            style={styles.bannerImage}
                            source={{ uri: IMAGE_BASE_URL + collectionDetail['backdrop_path'] }} />
                        <LinearGradient colors={['#FFFFFF00', '#FFFFFF00', '#000000']} style={{
                            position: 'absolute', width: '100%',
                            height: 210
                        }} />
                        <BasicDetailComponent collectionDetail={collectionDetail} />
                        <Divider />
                        <CollectionComponent
                            genre={genre}
                            movies={collectionDetail.parts}
                            onMovieClick={onMovieClick} />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const updateParams = (navigation, collectionDetail) => {
    if (collectionDetail !== null) {
        navigation.setOptions({ title: collectionDetail['name'] })
    }
}

const BasicDetailComponent = ({ collectionDetail }) => {
    return (
        <View style={styles.basicDetails}>
            <View style={{ marginHorizontal: 10, flex: 1, alignSelf: 'stretch' }}>
                <Text style={styles.title}>{collectionDetail['name']}</Text>
                <Text style={styles.description}>{collectionDetail['overview']}</Text>
            </View>
            <FastImage
                style={styles.posterImage}
                source={{ uri: IMAGE_BASE_URL + collectionDetail['poster_path'] }} />
        </View>
    );
}

const CollectionComponent = ({ genre, movies, onMovieClick }) => {
    if (movies.length > 0) {
        return (
            <View>
                <SectionHeader
                    title='This Collection Includes'
                    showAll={() => { }}
                    hideShowAll={true} />
                <FlatList
                    style={{ flexGrow: 0, marginTop: 8 }}
                    data={movies}
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
    // return <VerticalItem
    //     id={item.id}
    //     imageUrl={item['poster_path']}
    //     title={item['title']}
    //     description={genreNamesList}
    //     onClick={(id) => {
    //         onMovieClick(id)
    //     }}
    // />
    return <MovieListItem
        item={item}
        title={item.title}
        genreText={genreNamesList}
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
        fontSize: 14,
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

export default MovieCollectionDetail;