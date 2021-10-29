import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colorGrey, colorImageBorder } from '../utils/colors';
import FastImage from 'react-native-fast-image';
import { IMAGE_BASE_URL } from '../network/NetworkData';

const SmallBlockItem = ({ imageUrl, title, description }) => {
    return (
        <View style={styles.container}>
            <FastImage
                style={styles.image}
                source={{ uri: IMAGE_BASE_URL + imageUrl }} />
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.description} numberOfLines={1}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        alignItems: 'center'
    },
    image: {
        width: 40,
        height: 40,
        borderWidth: 0.5,
        borderColor: colorImageBorder,
    },
    textContainer: {
        marginStart: 8
    },
    title: {
        fontSize: 13,
        color: 'white',
        fontWeight: 'bold',
    },
    description: {
        fontSize: 12,
        color: colorGrey,
    }
});

export default SmallBlockItem;