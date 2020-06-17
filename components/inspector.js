import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { stylize } from '../helpers/stylize';

export default class Inspector extends React.Component {    
    constructor(props) {
        super(props)
        this.state = {
            html: undefined,
            lastHTML: "",
            stylized: undefined
        }
    }

    static getDerivedStateFromProps(props, state) {
        const renderHTML = (html) => {            
            console.log("Restylizing")
            let text = html.replace(/^<!-- PRAUXYGO DEPENENCY INJECTION, DO NOT TOUCH -->.*$\n/m, "").split("\n").map((i, key) => {
                return stylize(i, key);
            })
    
            return text;
        }
        return {
            html: props.html,
            lastHTML: state.html,
            stylized: (props.html == state.html ? state.stylized : renderHTML(props.html))
        }
    }

    render() {
        // console.log(this.props.html)
        return(<ScrollView style={styles.container}>
            {this.state.stylized || "Loading"}
        </ScrollView>)
    }
}

const styles = StyleSheet.create({
    container: {
        width: 4000
    },
    line: {
        color: "#FFF"
    }
});