import React from 'react';
import { View, Text } from 'react-native';

export default class Terminal extends React.Component {
    render() {
        return(
            <View style={{height: '100%', backgroundColor: '#2b333b', padding: 10}}>
                <Text style={{color: "#FFF", fontSize: 18}}>Terminal here eventually</Text>
            </View>
        )
    }
}