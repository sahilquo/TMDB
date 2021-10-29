import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { IMAGE_BASE_URL } from '../network/NetworkData';
import { colorGrey, colorImageBorder } from '../utils/colors';

const VerticalItem = ({ imageUrl, title, description }) => {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <FastImage
                    style={styles.image}
                    source={{ uri: IMAGE_BASE_URL + imageUrl }} />
            </View>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <Text style={styles.description} numberOfLines={1}>{description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        width: 135,
    },
    imageContainer: {
        borderWidth: 0.5,
        borderColor: colorImageBorder
    },
    image: {
        width: '100%',
        height: 150,
    },
    title: {
        fontSize: 13,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 8,
    },
    description: {
        fontSize: 12,
        color: colorGrey,
        marginBottom: 12
    }
});

export default VerticalItem;