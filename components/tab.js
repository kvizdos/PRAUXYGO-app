import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableWithoutFeedback, ScrollView, Button } from 'react-native';

export default class Tabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabs: this.props.tabs,
            activeTab: undefined
        }
    }

    static getDerivedStateFromProps(props, state) {
        return {
            tabs: props.tabs,
            activeTab: props.tabs.length != state.tabs.length ? props.tabs[props.tabs.length - 1] : state.activeTab
        }
    }

    setActiveTab(fileName) {
        this.setState({activeTab: fileName});
        this.props.openAction(fileName);
    }

    closeTab = (file) => {
        if(this.state.activeTab == file) {
            const loc = this.state.tabs.findIndex(i => i == file);

            if(this.state.tabs.length > 1) {
                this.setState({activeTab: this.state.tabs[loc + 1] != undefined ? this.state.tabs[loc + 1] : this.state.tabs[loc - 1]})
            } else {
                this.setState({activeTab: undefined})
            }
        }
        this.props.closeAction(file);
    }

    render() {
        return(
            <ScrollView style={styles.tabs} horizontal={true}>
                {[...this.state.tabs].map((fileName, key) => {
                    return ( <TouchableHighlight key={key} underlayColor="#6b7d8f" key={key} onPress={() => this.setActiveTab(fileName)} style={[styles.container, {backgroundColor: this.state.activeTab == fileName ? "#6b7d8f" : "#576878"}]}>
                        <View style={styles.tabContents}>
                            <Text ellipsizeMode='tail' style={{color: '#FFF'}} numberOfLines={1}>{[...fileName.split("/")].pop()}</Text>
                            <TouchableHighlight onPress={() => this.closeTab(fileName)}>
                                <Text>&times;</Text>
                            </TouchableHighlight>
                        </View> 
                    </TouchableHighlight> )
                })}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: 200,
        padding: 10,
        borderRightWidth: 3,
        borderRightColor: "#495969",
    },
    tabContents: {
        justifyContent: "space-between",
        flexDirection: "row",
    },
    tabs: {
        flexDirection: "row",
        overflow: "scroll",
    }
});