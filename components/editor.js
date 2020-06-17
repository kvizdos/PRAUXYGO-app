import React from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, AsyncStorage, TouchableOpacity } from 'react-native';
import Tabs from './tab'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { makeRequest, CREATENETWORKURL } from '../helpers/networking';
import { Button } from 'react-native-elements';
import { skipFileTypes } from '../helpers/config.js';
import { stylize } from '../helpers/stylize';

export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: this.props.openedTabs,
            tabs: this.props.openedTabs.map(i => i.file),
            activeFile: { file: ".html", contents: "No file selected" },
            formattedText: undefined,
            unformattedText: undefined,
            measureMe: "",
            mainWidth: 0,
            currentCursorIndex: -1,
            lineCounters: [],
            webview: undefined
        }
    }

    findAtIndex = (array, i, current, total) => {
        var c = array.shift() + " ";
        total += c.length;    
        if(i <= total) {
            return current;
        }
    
        current++;

        return array.length > 0 ? this.findAtIndex(array, i, current, total) : -1
    }

    formatText = (enteredText) => {        
        this.setState({lineCounters: this.renderLines(`${enteredText.toString()}`)});
        if(true || this.state.currentCursorIndex == -1) {
            this.setState({unformattedText: `${enteredText}`.toString().split("\n").map((i, key) => {
                return i;
            }).join("\n")});

            this.setState({formattedText: enteredText.toString().split("\n").map((i, key) => {
                return <Text style={{lineHeight: 18, width: 10000}} numberOfLines={1} ellipsizeMode="head" key={key}>{stylize(i, key) + (key == enteredText.split("\n").length - 1 ? "" : "\n")}</Text>
            })});

        } 
    };

    openFile = (fileName, updateState = false) => {
        // console.log("FILENAME: " + this.state.activeFile.file + " NOT " + fileName)
        // console.log("Active contents: " + this.state.activeFile.contents.substring(0, 10));
        // console.log("New " + this.state.unformattedText.substring(0, 10))
        
        // if(updateState && fileName != this.state.activeFile.file) this.props.updateFile(this.state.activeFile.file, this.state.unformattedText)
        this.setState({
            activeFile: this.state.files.filter(i => i.file == fileName)[0]
        })

        this.formatText(this.state.files.filter(i => i.file == fileName)[0].contents);
    }
    
    closeFile = (file, revert = false) => {
        if(this.state.activeFile.file == file) {
            const loc = this.state.tabs.findIndex(i => i == file);

            if(this.state.tabs.length > 1) {
                this.setState({activeFile: this.state.files[loc + 1] != undefined ? this.state.files[loc + 1] : this.state.files[loc - 1]})
            } else {
                this.setState({activeFile: { file: ".html", contents: "No file selected" }})
            }
        };

        this.props.removeFromChangelist(file);

        this.props.closeFile(file, revert);
    }
    renderLines = (text) => {
        return Array.from({length: text.match(/\n/gm).length + 1}, (_, i) => {
            return (<View key={i} style={{alignItems: "flex-end", marginRight: 5}}>
                             <Text style={{color: "#586673", paddingLeft: 5, margin: 0, paddingBottom: 0, paddingTop: 0, lineHeight: 18, alignItems: "center"}} key={i}>{i + 1}</Text>
                         </View>)
        })
    }

    setSelection = ({selection}) => {
        var line = this.state.unformattedText.substring(this.state.unformattedText.substring(0, selection.start).lastIndexOf("\n") + 1, selection.start) + this.state.unformattedText.substring(selection.start, selection.start + this.state.unformattedText.substring(selection.start).indexOf("\n"))
    
        const lineStart = selection.start - this.state.unformattedText.substring(0, selection.start).lastIndexOf("\n") - 1

        const onLine = this.findAtIndex(JSON.parse(JSON.stringify(this.state.unformattedText)).split("\n"), selection.start, 0, 0);

        this.setState({currentCursorIndex: onLine != -1 ? onLine : this.state.unformattedText.split("\n").length})

        this.setState({measureMe: line.substring(0, lineStart)}, () => {        
            setTimeout(() => this.refs.measureMe.measure((fx, fy, width, height, px, py) => {
                let scrollToX = width - (this.state.mainWidth - 65) > 0 ? width - (this.state.mainWidth - 35) + 50 : 0;

                if(this.codeEditor != undefined) this.codeEditor.scrollTo({y: 0, x: scrollToX, animated: true});

            }), 10)

        });
    }

    static getDerivedStateFromProps(props, state) {
        const renderLines = (text) => {
            let lineNumbers = [];
            for(let i = 0; i < text.split("\n").length; i++) {
                lineNumbers.push(<View key={i} style={{alignItems: "flex-end", marginRight: 5}}>
                        <Text style={{color: "#586673", paddingLeft: 5, margin: 0, paddingBottom: 0, paddingTop: 0, lineHeight: 18, alignItems: "center"}} key={i}>{i + 1}</Text>
                    </View>)
            }    
            return lineNumbers;
        }
        const renderHTML = (html) => {            
            console.log("Restylizing")
            let text = html.replace(/^<!-- PRAUXYGO DEPENENCY INJECTION, DO NOT TOUCH -->.*$\n/m, "").split("\n").map((i, key) => {
                return stylize(i, key);
            })
    
            return text;
        }

        const files = props.openedTabs.filter(i => i.file != "none" && i.contents != "No file opened");
        const tabs = props.openedTabs.filter(i => i.file != "none" && i.contents != "No file opened").map(i => i.file);
        
        const file = (files.length > 0 && files.length != state.files.length ? files[files.length - 1] : state.activeFile);

        return {
            files: files,
            tabs: tabs,
            activeFile: file,
            formattedText: file.contents.toString().split("\n").map((i, key) => {
                // return stylize(i, key, true, false);
                return <Text style={{lineHeight: 18, width: 10000}} numberOfLines={1} ellipsizeMode="head" key={key}>{i + (key == file.contents.split("\n").length - 1 ? "" : "\n")}</Text>
            }),
            unformattedText: state.activeFile.file == ".html" && state.activeFile.contents == "No file selected" ? file.contents.toString().split("\n").map((i, key) => {
                return i;
            }).join("\n") : state.unformattedText,
            lineCounters: state.activeFile.file == ".html" && state.activeFile.contents == "No file selected" ? renderLines(file.contents.toString()) : state.lineCounters,
            webview: props.webview
        }
    }

    _onLayoutEvent = (e) => {
        this.setState({mainWidth: e.nativeEvent.layout.width})
    }

    saveFile = async () => {
        if(skipFileTypes.indexOf(this.state.activeFile.file.split(".").splice(-1)) != -1) return;

        const file = this.state.activeFile.file;
        const contents = this.state.unformattedText.replace(/“|”/gm, '"').replace(/‘|’/gm, "'");

        if(this.props.getChangedFiles().findIndex(i => i == this.state.activeFile.file) == -1) return;

        makeRequest("/prauxyapi/update", {
            method: "POST",
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json",
                Authorization: `Bearer ${await AsyncStorage.getItem("@UserInfo:username")}:${await AsyncStorage.getItem("@UserInfo:token")}`
            },
            body: JSON.stringify({
                file: file,
                contents: contents 
            })
        }, CREATENETWORKURL(this.props.id)).then(r => {
            this.props.updateFile(file, contents);
            this.props.removeFromChangelist(file);

            this.state.webview.reload();
        })
    }

    render() {
        return(
            <View style={{flex: 1, backgroundColor: "#252c33", position: 'relative', zIndex: 10}} onLayout={this._onLayoutEvent}>
                <View style={{height: 40,backgroundColor: "#6c7782", flexDirection: "row"}}>
                    <View style={{justifyContent: "center", padding: 8, backgroundColor: "#829eba"}}>
                        <Icon name="save" size={21} color={this.props.getChangedFiles().findIndex(i => i == this.state.activeFile.file) != -1 ? "#FFF" : "#bababa"} onPress={this.saveFile}/>
                    </View>
                    <Tabs saveFile={this.saveFile} openModal={this.props.openModal} changedFiles={this.props.getChangedFiles} tabs={this.state.tabs} openAction={(file) => {this.openFile(file, true);}} closeAction={this.closeFile}></Tabs>
                </View>
                <View style={{flex: 1, flexDirection: "row"}}>
                    <ScrollView horizontal={true} ref={ref => this.codeEditor = ref }> 
                        <ScrollView ref={ref => this.codeEditorVert = ref } onContentSizeChange={() => this.codeEditorVert.scrollToEnd({ animated: false })}>
                        {/* <ScrollView  horizontal={true}> onContentSizeChange={() => this.codeEditor.scrollToEnd({ animated: false })} */}
                            <View style={{flex: 1, flexDirection: "row"}}>
                                <View style={{paddingTop: 10}}>
                                    {this.state.lineCounters}
                                </View>
                                    <TextInput onSelectionChange={({ nativeEvent: { selection } }) => { this.setSelection({ selection }) }} style={{paddingRight: 100, color: "#f0f0f0", paddingTop: 10, overflow: "hidden", flexWrap: "wrap"}} multiline autoCorrect={false} autoCapitalize="none" onChangeText={(text) => {this.formatText(text); this.props.changeFile(this.state.activeFile.file, text);} }>
                                        {this.state.formattedText}
                                    </TextInput>
                            </View>
                        {/* </ScrollView> */}
                        </ScrollView>
                        </ScrollView>
                        
                <View style={{zIndex: 0, flex: 1, flexWrap: "nowrap", left: -1000000, top: -10000000, position: 'absolute', alignItems: "center"}}>
                    <Text ref="measureMe" style={{backgroundColor: "red"}}>{this.state.measureMe}</Text>
                </View>
                </View>
            </View>
        )
    }
}