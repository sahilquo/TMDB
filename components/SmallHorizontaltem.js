import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colorImageBorder, colorGrey } from '../utils/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IMAGE_BASE_URL } from '../network/NetworkData';

const SmallHorizontalItem = ({ id, imageUrl, title, description, onClick }) => {
    return (
        <TouchableWithoutFeedback style={{ backgroundColor: 'blue' }} onPress={() => onClick(id)}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Icon
                        name='image'
                        color='#B5B5B5'
                        size={22}
                        style={[styles.image, {
                            position: 'absolute',
                            backgroundColor: '#DBDBDB',
                            textAlign: 'center',
                            textAlignVertical: 'center'
                        }]} />
                    <FastImage
                        style={styles.image}
                        source={{ uri: IMAGE_BASE_URL + imageUrl }} />
                </View>
                <View style={{ marginStart: 8, flex: 1 }}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    <Text style={styles.description} numberOfLines={1}>{description}</Text>
                </View>
                <Icon name='keyboard-arrow-right' size={32} color={colorGrey} />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 12,
        width: Dimensions.get('screen').width - 110,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6
    },
    imageContainer: {
        borderWidth: 0.5,
        borderColor: colorImageBorder,
    },
    image: {
        width: 40,
        height: 40,
    },
    title: {
        fontSize: 13,
        color: 'white',
        fontWeight: 'bold',
    },
    description: {
        fontSize: 12,
        color: colorGrey,
        marginTop: 2
    }
});

export default SmallHorizontalItem;