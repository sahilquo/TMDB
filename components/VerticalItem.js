import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { colorGrey, colorImageBorder } from '../utils/colors';

const VerticalItem = () => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Venom_Let_There_Be_Carnage_poster.jpg' }} />
            <Text
                style={styles.title}
                numberOfLines={2}
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
        width: 135,
    },
    image: {
        width: '100%',
        height: 150,
        borderWidth: 0.5,
        borderColor: colorImageBorder,
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