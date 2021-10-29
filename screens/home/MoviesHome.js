import React from 'react'
import { Text, View, StyleSheet } from 'react-native';
import HorizontalItem from '../../components/HorizontalItem';
import SectionHeader from '../../components/SectionHeader';
import VerticalItem from '../../components/VerticalItem';
import { globalStyles } from '../../utils/globalStyles';

const MoviesHome = () => {
    return (
        <View style={[globalStyles.container, styles.container]}>

            <SectionHeader />
            <VerticalItem />
            <HorizontalItem />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    }
});

export default MoviesHome;