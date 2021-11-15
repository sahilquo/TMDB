import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colorGrey } from '../utils/colors';

const RoundedImage = ({ imageUrl, size }) => {
    let style = {};
    if (size != null) {
        style['width'] = size;
        style['height'] = size;
        style['borderRadius'] = size / 2;
    }
    return (
        <View style={[styles.container, style]}>
            <Icon
                name='person'
                color={colorGrey}
                size={size != null ? size : 90}
                style={{ position: 'absolute', }} />
            <FastImage
                style={[styles.image]}
                source={{ uri: imageUrl }}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        height: 90,
        width: 90,
        borderRadius: 45,
        borderColor: 'white',
        alignSelf: 'center',
        borderWidth: 1,
        overflow: 'hidden'
    },
    image: {
        height: '100%',
        width: '100%',
    }
});

export default RoundedImage;