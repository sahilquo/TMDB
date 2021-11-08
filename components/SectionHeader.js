import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colorGrey } from '../utils/colors';

const SectionHeader = ({ title, hideShowAll, showAll }) => {
    return (
        <View style={styles.container}>
            <Text
                style={styles.header}
                numberOfLines={1}
            >
                {title}
            </Text>
            {hideShowAll ? null :
                <TouchableOpacity
                    style={styles.seeAll}
                    onPress={() => showAll()}>
                    <Text style={{ fontSize: 13, color: colorGrey }}>See all</Text>
                    <Icon name='keyboard-arrow-right' size={20} color={colorGrey} />
                </TouchableOpacity>
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    header: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    seeAll: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8
    }
});

export default SectionHeader;