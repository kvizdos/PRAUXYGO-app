import React from 'react';
import { StyleSheet, View } from 'react-native';

export default class Card extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View style={styles.card}>
                {this.props.children}
            </View>
            )
    }
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 2,
        borderRadius: 2,
        borderColor: "#e8e8e8",
        backgroundColor: "#FFF",
        padding: 25,
    }
})