import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colorImageBorder, colorGrey } from '../../utils/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IMAGE_BASE_URL } from '../../network/NetworkData';
import RoundedImage from '../../components/RoundedImage';

const PersonHorizontalItem = ({ id, imageUrl, title, description, onClick }) => {
    return (
        <TouchableWithoutFeedback style={{ backgroundColor: 'blue' }} onPress={() => onClick(id)}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ alignSelf: 'flex-start', marginTop: 12 }}>
                        <RoundedImage
                            imageUrl={IMAGE_BASE_URL + imageUrl}
                            size={80} />
                    </View>
                    <View style={{ marginStart: 8, flex: 1 }}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description}>{description}</Text>
                    </View>
                    <Icon name='keyboard-arrow-right' size={32} color={colorGrey} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 12,
        width: Dimensions.get('screen').width - 120,
    },
    imageContainer: {
        borderWidth: 1,
        borderColor: colorImageBorder,
        borderRadius: 10
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10
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
        marginTop: 2
    }
});

export default PersonHorizontalItem;