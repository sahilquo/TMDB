import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colorGrey, colorImageBorder } from '../utils/colors';
import FastImage from 'react-native-fast-image';
import { IMAGE_BASE_URL } from '../network/NetworkData';

const HorizontalItem = ({ imageUrl, title, description }) => {
    return (
        <View style={styles.container}>
            <FastImage
                style={styles.image}
                source={{ uri: IMAGE_BASE_URL + imageUrl }} />
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.description} numberOfLines={1}>{description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        width: 240,
    },
    image: {
        width: '100%',
        height: 130,
        borderWidth: 0.5,
        borderColor: colorImageBorder,
    },
    title: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 8,
    },
    description: {
        fontSize: 13,
        color: colorGrey,
        marginBottom: 8
    }
});

export default HorizontalItem;