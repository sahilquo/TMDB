import React from 'react'
import { Text, View, StyleSheet } from 'react-native';
import { globalStyles } from '../../utils/globalStyles';

const TVShowsHome = () => {
    return (
        <View style={[globalStyles.container, styles.container]}>
            <Text>TV Shows Home</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    }
});

export default TVShowsHome;