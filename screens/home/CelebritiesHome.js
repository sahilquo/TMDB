import React from 'react'
import { Text, View, StyleSheet } from 'react-native';
import { globalStyles } from '../../utils/globalStyles';

const CelebritiesHome = () => {
    return (
        <View style={[globalStyles.container, styles.container]}>
            <Text>Celebrities Home</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    }
});

export default CelebritiesHome;