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
            formattedText: undefined,
            unformattedText: undefined,
            measureMe: "",
            mainWidth: 0,
            currentCursorIndex: -1
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
                return <Text style={{lineHeight: 18, width: 10000}} numberOfLines={1} ellipsizeMode="head" key={key}>{i + (key == enteredText.split("\n").length - 1 ? "" : "\n")}</Text>
            })});

        } 
        // else {
        //     let unformattedText = this.state.unformattedText.split("\n");
        //     let formattedText = this.state.formattedText;
        //     const currentCursorIndex = this.state.currentCursorIndex;
        //     // if(currentCursorIndex == unformattedText.length) {
        //     //     console.log("Ooeopepsps")
        //     //     console.log(enteredText.split("\n").length + " " + unformattedText.length + " " + formattedText.length + " " + currentCursorIndex)
        //     //     unformattedText.push({});
        //     //     formattedText.push({})
        //     //     console.log(enteredText.split("\n").length + " " + unformattedText.length + " " + formattedText.length + " " + currentCursorIndex)
        //     // }
        //     const updatedLine = enteredText.split("\n")[currentCursorIndex];
        //     const updatedLine2 = enteredText.split("\n")[currentCursorIndex + 1];


        //     // if(currentCursorIndex == unformattedText.length) {
        //     //     console.log("Setting")
        //     //     this.setState({lineCounters: [...this.state.lineCounters, this.renderLines("", currentCursorIndex)]});
        //     // }

        //     formattedText[currentCursorIndex] = <Text style={{lineHeight: 18, width: 10000, color: "orange"}} numberOfLines={1} ellipsizeMode="head" key={currentCursorIndex}>{updatedLine + (currentCursorIndex == enteredText.split("\n").length - 1 ? "" : "\n")}</Text>
        //     formattedText[currentCursorIndex + 1] = <Text style={{lineHeight: 18, width: 10000, color: "orange"}} numberOfLines={1} ellipsizeMode="head" key={currentCursorIndex + 1}>{updatedLine2 + (currentCursorIndex + 1 == enteredText.split("\n").length - 1 ? "" : "\n")}</Text>
            
        //     this.setState({unformattedText: unformattedText.join("\n")});

        //     this.setState({formattedText: formattedText}, () => {
        //         const t2 = +new Date();

        //         console.log("time === " + (t2 - t1))
        //     })
        // }
    };

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
        };

        this.props.closeFile(file);
    }
    renderLines = (text, num) => {
        let lineNumbers = [];
        if(num == undefined) {
            for(let i = 0; i < text.split("\n").length; i++) {
                lineNumbers.push(<View key={i} style={{alignItems: "flex-end", marginRight: 5}}>
                        <Text style={{color: "#586673", paddingLeft: 5, margin: 0, paddingBottom: 0, paddingTop: 0, lineHeight: 18, alignItems: "center"}} key={i}>{i + 1}</Text>
                    </View>)
            }
        } else {
            num++;
            lineNumbers = (<View key={num} style={{alignItems: "flex-end", marginRight: 5}}>
                        <Text style={{color: "#586673", paddingLeft: 5, margin: 0, paddingBottom: 0, paddingTop: 0, lineHeight: 18, alignItems: "center"}} key={num}>{num + 1}</Text>
                    </View>)
        }

        return lineNumbers;
    }

    setSelection = ({selection}) => {
        var line = this.state.unformattedText.substring(this.state.unformattedText.substring(0, selection.start).lastIndexOf("\n") + 1, selection.start) + this.state.unformattedText.substring(selection.start, selection.start + this.state.unformattedText.substring(selection.start).indexOf("\n"))
    
        const lineStart = selection.start - this.state.unformattedText.substring(0, selection.start).lastIndexOf("\n") - 1

        const onLine = this.findAtIndex(JSON.parse(JSON.stringify(this.state.unformattedText)).split("\n"), selection.start, 0, 0);

        this.setState({currentCursorIndex: onLine != -1 ? onLine : this.state.unformattedText.split("\n").length})

        this.setState({measureMe: line.substring(0, lineStart)}, () => {        
            setTimeout(() => this.refs.measureMe.measure((fx, fy, width, height, px, py) => {
                let scrollTo = width - (this.state.mainWidth - 65) > 0 ? width - (this.state.mainWidth - 35) + 50 : 0;
                if(this.codeEditor != undefined) this.codeEditor.scrollTo({y: 0, x: scrollTo, animated: true});

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

        const files = props.openedTabs.filter(i => i.file != "none" && i.contents != "No file opened");
        const tabs = props.openedTabs.filter(i => i.file != "none" && i.contents != "No file opened").map(i => i.file);
        
        const file = (files.length > 0 && files.length != state.files.length ? files[files.length - 1] : state.activeFile);

        return {
            files: files,
            tabs: tabs,
            activeFile: file,
            formattedText: state.activeFile.file == ".html" && state.activeFile.contents == "No file selected" ? file.contents.toString().split("\n").map((i, key) => {
                return <Text style={{lineHeight: 18, width: 10000}} numberOfLines={1} ellipsizeMode="head" key={key}>{i + (key == file.contents.split("\n").length - 1 ? "" : "\n")}</Text>
            }) : state.formattedText,
            unformattedText: state.activeFile.file == ".html" && state.activeFile.contents == "No file selected" ? file.contents.toString().split("\n").map((i, key) => {
                return i;
            }).join("\n") : state.unformattedText,
            lineCounters: state.activeFile.file == ".html" && state.activeFile.contents == "No file selected" ? renderLines(file.contents.toString()) : state.lineCounters
        }
    }

    _onLayoutEvent = (e) => {
        this.setState({mainWidth: e.nativeEvent.layout.width})
    }

    render() {
        return(
            <View style={{flex: 1, backgroundColor: "#252c33", position: 'relative', zIndex: 10}} onLayout={this._onLayoutEvent}>
                <View style={{height: 40,backgroundColor: "#6c7782"}}>
                    <Tabs tabs={this.state.tabs} openAction={this.openFile} closeAction={this.closeFile}></Tabs>
                </View>
                <View style={{flex: 1, flexDirection: "row"}}>
                    <ScrollView horizontal={true} ref={ref => this.codeEditor = ref }> 
                        <ScrollView ref={ref => this.codeEditorVert = ref } onContentSizeChange={() => this.codeEditorVert.scrollToEnd({ animated: false })}>
                        {/* <ScrollView  horizontal={true}> onContentSizeChange={() => this.codeEditor.scrollToEnd({ animated: false })} */}
                            <View style={{flex: 1, flexDirection: "row"}}>
                                <View style={{paddingTop: 10}}>
                                    {this.state.lineCounters}
                                </View>
                                    <TextInput onSelectionChange={({ nativeEvent: { selection } }) => { this.setSelection({ selection }) }} style={{paddingRight: 100, color: "#f0f0f0", paddingTop: 10, overflow: "hidden", flexWrap: "wrap"}} multiline autoCorrect={false} autoCapitalize="none" onChangeText={this.formatText}>
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