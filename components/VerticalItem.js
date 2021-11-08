import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';
import { IMAGE_BASE_URL } from '../network/NetworkData';
import { colorGrey, colorImageBorder } from '../utils/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VerticalItem = ({ id, imageUrl, title, description, onClick, item }) => {
    return (
        <TouchableWithoutFeedback onPress={() => onClick(id, item)}>
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
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                {
                    description != null
                        ? <Text style={styles.description} numberOfLines={1}>{description}</Text>
                        : null
                }
            </View>
        </TouchableWithoutFeedback>
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