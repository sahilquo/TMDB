import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { colorGrey, colorImageBorder } from '../utils/colors';
import FastImage from 'react-native-fast-image';
import { IMAGE_BASE_URL } from '../network/NetworkData';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HorizontalItem = ({ id, imageUrl, title, description, onClick }) => {
    return (
        <TouchableWithoutFeedback onPress={() => onClick(id)}>
            <View style={styles.container}>
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
                        source={{ uri: IMAGE_BASE_URL + imageUrl }} />
                </View>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.description} numberOfLines={1}>{description}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        width: 240,
    },
    imageContainer: {
        borderWidth: 0.5,
        borderColor: colorImageBorder
    },
    image: {
        width: '100%',
        height: 130,
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