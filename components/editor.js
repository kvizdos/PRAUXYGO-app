import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import Tabs from './tab'

export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: this.props.openedTabs,
            tabs: this.props.openedTabs.map(i => i.file),
            activeFile: { file: ".html", contents: "No file selected" },
            formattedText: ""
        }
    }

    openFile = (fileName) => {
        this.setState({
            activeFile: this.state.files.filter(i => i.file == fileName)[0]
        })

        this.formatText(this.state.files.filter(i => i.file == fileName)[0].contents);
    }
    
    closeFile = (file) => {
        if(this.state.activeFile.file == file) {
            const loc = this.state.tabs.findIndex(i => i == file);

            if(this.state.tabs.length > 1) {
                this.setState({activeFile: this.state.files[loc + 1] != undefined ? this.state.files[loc + 1] : this.state.files[loc - 1]})
            } else {
                this.setState({activeFile: { file: ".html", contents: "No file selected" }})
            }
        }

        this.props.closeFile(file);
    }

    formatText = (enteredText) => this.setState({formattedText: enteredText});

    static getDerivedStateFromProps(props, state) {
        const files = props.openedTabs.filter(i => i.file != "none" && i.contents != "No file opened");
        const tabs = props.openedTabs.filter(i => i.file != "none" && i.contents != "No file opened").map(i => i.file);

        return {
            files: files,
            tabs: tabs,
            activeFile: files.length > 0 && files.length != state.files.length ? files[files.length - 1] : state.activeFile,
            formattedText: state.formattedText
        }
    }

    render() {
        return(
            <View style={{flex: 1, backgroundColor: "#252c33", position: 'relative', zIndex: 10}}>
                <View style={{height: 40,backgroundColor: "#6c7782"}}>
                    <Tabs tabs={this.state.tabs} openAction={this.openFile} closeAction={this.closeFile}></Tabs>
                </View>
                <View style={{flex: 1}}>
                    <ScrollView horizontal={true} style={{flexDirection: "column"}} ref={ref => this.codeEditor = ref } onContentSizeChange={() => this.codeEditor.scrollToEnd({ animated: false })} >
                        <TextInput style={{flex: 1, color: "#f0f0f0", padding: 10, overflow: "scroll", flexWrap: "nowrap"}} multiline autoCorrect={false} autoCapitalize="none" onChangeText={this.formatText}>{this.state.activeFile.contents}</TextInput>
                    </ScrollView>
                </View>
            </View>
        )
    }
}