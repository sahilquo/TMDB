import React from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getVideoThumbnail } from '../utils/ValueUtils';

const VideoTileItem = ({ item, onClick }) => {
    return (
        <TouchableWithoutFeedback onPress={() => onClick(item['key'])}>
            <View style={styles.container}>
                <FastImage
                    style={styles.image}
                    source={{ uri: getVideoThumbnail(item['key']) }} />
                <View style={styles.iconContainer}>
                    <Image
                        source={require('../assets/icons/youtube.png')}
                        style={styles.icon}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        width: 200,
        justifyContent: 'flex-end'
    },
    image: {
        width: '100%',
        height: 100,
        borderWidth: 1,
        borderColor: 'white',
    },
    iconContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        padding: 2,
        borderRadius: 4,
        alignSelf: 'flex-end',
        right: 18,
        bottom: 6
    },
    icon: {
        width: 20,
        height: 15,

    }
});

export default VideoTileItem;