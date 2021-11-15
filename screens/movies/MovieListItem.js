import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colorImageBorder, colorGrey, colorAccentDark } from '../../utils/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IMAGE_BASE_URL } from '../../network/NetworkData';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { roundNum } from '../../utils/ValueUtils';

const MovieListItem = ({ item, title, genreText, onClick }) => {
    return (
        <TouchableWithoutFeedback onPress={() => onClick(item.id)}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', }}>
                    <View style={styles.imageContainer}>
                        <Icon
                            name='image'
                            color='#B5B5B5'
                            size={44}
                            style={[styles.image, {
                                position: 'absolute',
                                backgroundColor: '#DBDBDB',
                                textAlign: 'center',
                                textAlignVertical: 'center'
                            }]} />
                        <FastImage
                            style={styles.image}
                            source={{ uri: IMAGE_BASE_URL + item['poster_path'] }}
                        />
                    </View>
                    <View style={{ marginStart: 8, flex: 1 }}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description}>{genreText}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                            <StarRatingDisplay
                                rating={roundNum(item['vote_average'] / 2)}
                                maxStars={5}
                                starSize={16}
                                color={colorAccentDark}
                                starStyle={{
                                    marginHorizontal: 0
                                }}
                            />
                            <Text style={styles.ratingCount}>( {item['vote_count']} )</Text>
                        </View>
                    </View>
                    <Icon name='keyboard-arrow-right' size={32} color={colorGrey} style={{ alignSelf: 'center' }} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 12,
    },
    imageContainer: {
        borderWidth: 1,
        borderColor: colorImageBorder,
    },
    image: {
        width: 75,
        height: 100,
    },
    title: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 4,
    },
    description: {
        fontSize: 14,
        color: colorGrey,
        marginTop: 2
    },
    ratingCount: {
        color: colorAccentDark,
        fontSize: 12,
        marginStart: 4,
        fontWeight: 'bold',
        includeFontPadding: false
    },
});

export default MovieListItem;