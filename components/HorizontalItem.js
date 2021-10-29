import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { colorGrey, colorImageBorder } from '../utils/colors';

const HorizontalItem = () => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={{ uri: 'https://www.cnet.com/a/img/5OVL3iMZjo0wld8Uj15_C00bqKo=/940x0/2021/09/03/afa4abf1-ea46-45bf-b4d0-84259920a236/qlwgiefucodivdzjgil7.jpg' }} />
            <Text
                style={styles.title}
                numberOfLines={1}
            >
                Venom: Let There Be Carnage
            </Text>
            <Text
                style={styles.description}
                numberOfLines={1}
            >
                Science Fiction, Action
            </Text>
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