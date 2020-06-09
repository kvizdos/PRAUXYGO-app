import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Tabs from './tab'
import { TextInput } from 'react-native-gesture-handler';

export default class WebPreview extends React.Component {    
    constructor(props) {
        super(props)
        this.state = {
            width: 700,
            devToolsOpen: this.props.devToolsOpen,
            showInspector: false,
            showConsole: true,
            consoleMessages: [],
            consoleHistory: [],
            consoleHistoryLocation: -1,
            activeKeys: "",
            lastAction: undefined,
            isHoldingShortcut: false
        }
    }
    
    measureView = (event) => {
        this.setState({width: event.nativeEvent.layout.x})
    }

    getCode = (e) => {
        const data = JSON.parse(e.nativeEvent.data)
        if(data.code == undefined) {
            this.setState({consoleMessages: [...this.state.consoleMessages, data]})
        }
    }

    changeInspector = (tool) => {
        switch(tool) {
            case "Inspector":
                this.setState({showConsole: false, showInspector: true})
                break;
            case "Console":
                this.setState({showConsole: true, showInspector: false})
                break;
            default:
                alert(tool)
        }
    }

    submitCommand = (e) => {
        const CMD = e.nativeEvent.text.replace(/‘/gm, "'").replace(/[“”]/gm, '"');
        const localActions = ["clear", ""];

        if(!localActions.includes(CMD)) {
            this.setState({consoleMessages: [...this.state.consoleMessages, {message: CMD, type: "command"}]})
            this.refs.webview.postMessage(JSON.stringify({action: "cmd", cmd: CMD}))
        } else {
            switch(CMD) {
                case "":
                    break;
                case "clear":
                    this.setState({consoleMessages: [{message: "Console cleared", type: "command"}]});
                    break;
            }
        }

        this.setState({consoleHistory: [...this.state.consoleHistory, CMD]});
        this.setState({consoleHistoryLocation: this.state.consoleHistory.length})
        this.setState({activeKeys: ""})

        this.cmdInput.clear();
    };

    detectKeybind = (e) => {
        this.setState({activeKeys: `${e}`})

        const text = e;
        const activeKeys = `${text}`.slice(-2);

        if(this.state.isHoldingShortcut && activeKeys.slice(0, 1) == "`") {
            switch(activeKeys.slice(1)) {
                case ",":
                    if(this.state.consoleHistoryLocation != -1) {
                        this.setState({activeKeys: this.state.consoleHistory[this.state.consoleHistoryLocation]});
                        let ns = this.state.consoleHistoryLocation.valueOf();
                        ns -= 1;
                        if(this.state.consoleHistoryLocation != 0) this.setState({consoleHistoryLocation: ns})
                    } else {
                        this.setState({activeKeys: text.substring(0, text.length - 2)})
                    }

                    break;
                case ".":
                    if(this.state.consoleHistoryLocation != this.state.consoleHistory.length - 1) {
                        this.setState({activeKeys: this.state.consoleHistory[this.state.consoleHistoryLocation += 1]});
                        if(this.state.consoleHistoryLocation != this.state.consoleHistory.length - 1) {
                            this.setState({consoleHistoryLocation: this.state.consoleHistoryLocation})
                        } 
                    } else {
                        this.setState({consoleHistoryLocation: this.state.consoleHistory.length - 1})

                        this.setState({activeKeys: ""})
                    }

                    break;
            }

            this.setState({isHoldingShortcut: false});
        } else {
            if(activeKeys.length > 1 ? activeKeys.slice(1) == "`" : activeKeys == "`") {
                this.setState({shortcutTimeout: setTimeout(() => {
                    this.setState({isHoldingShortcut: false})
                }, 250)})
                this.setState({isHoldingShortcut: true});
            }
        }
    }

    componentDidMount() {
        this.refs.webview.postMessage("hello")
        this.props.setWebView(this.refs.webview);
    }

    static getDerivedStateFromProps(props, state) {
        return {
            width: state.width,
            devToolsOpen: props.devToolsOpen
        }
    }
    
    render() {
        // const INJECTEDJAVASCRIPT = `window.ReactNativeWebView.postMessage(JSON.stringify({code: document.getElementsByTagName('html')[0].innerHTML})); const _prLOG = console.log, _prWARN = console.warn, _prERROR = console.error; console.log = (m) => { window.ReactNativeWebView.postMessage(JSON.stringify({message: m, type: "log"})); _prLOG(m); return m; }; console.warn = (m) => { window.ReactNativeWebView.postMessage(JSON.stringify({message: m, type: "warn"})); _prWARN(m); return m; }; console.error = (m) => { window.ReactNativeWebView.postMessage(JSON.stringify({message: m, type: "error"})); _prERROR(m); return m; }; this.window.addEventListener("message", (event) => { try { var resp = eval(JSON.parse(event.data).cmd); console.log(typeof resp == "object" ? JSON.stringify(resp) : resp.toString().trim()) } catch(e) { console.error(JSON.stringify(e.message)) }; });`

        return(
            <View style={{flex: 1}}>
                <WebView 
                ref="webview"
                // ref={webview => (this.refs.webview = webview)}
                // injectedJavaScript={INJECTEDJAVASCRIPT}
                scalesPageToFit={true}
                onMessage={this.getCode}
                bounces={true}
                originWhitelist={['*']}
                // style={{width: 1920, height: 1080, position: 'relative', left: -(Math.pow(SCALE, (1 / SCALE)) / 1920), top: -(540 * SCALE), zIndex: 0, transform: [ { scale: SCALE } ]}}
                source={{
                    uri: this.props.previewURL
                }}/>
                {this.state.devToolsOpen && <View style={styles.devTools}>
                    <View style={{height: 40,backgroundColor: "#6c7782"}}>
                        <Tabs tabs={["Inspector", "Console"]} openAction={this.changeInspector} closeAction={() => consolelog()}></Tabs>
                    </View>
                    
                    {this.state.showInspector && <View>
                            <Text>Inspector Enabled</Text>
                    </View>}
                    {this.state.showConsole && <View style={styles.console}>
                        <ScrollView style={{flex: .9}} ref={ref => this.consoleHistory = ref } onContentSizeChange={() => this.consoleHistory.scrollToEnd({ animated: true })}>
                            {this.state.consoleMessages.map((message, i) => {
                                let isCaughtError = false;
                                try {
                                    isCaughtError = JSON.parse(message.message).type == "errorcaught"
                                } catch(e) {
                                    isCaughtError = false;
                                }
                                return <View key={i} style={{borderBottomWidth: 1.5, borderBottomColor: "#949494", padding: 5}}><Text style={[styles.consoleText, message.type == "error" || message.type == "errorcaught" ? styles.errorLog : message.type == "warn" ? styles.warnLog : message.type == "log" ? styles.responseLog : {}]}>
                                    {isCaughtError && JSON.parse(message.message).error }
                                    {!isCaughtError && message.message}
                                    </Text>
                                    {isCaughtError && <Text style={{backgroundColor: "#b31f15", color: "#ffc8c4", padding: 2}}>
                                        {JSON.parse(message.message).url}:{JSON.parse(message.message).line - 1}
                                        </Text>}
                                    </View>
                            })}
                        </ScrollView>
                        <TextInput onChangeText={this.detectKeybind} value={this.state.activeKeys} onplaceholder="Enter a command" ref={input => { this.cmdInput = input }} numberOfLines={1} autoCorrect={false} autoCapitalize="none" fontSize={16} style={styles.consoleEnter} onSubmitEditing={this.submitCommand} />
                    </View>}
                </View>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    devTools: {
        flex: .4,
    },
    console: {
        flex: 1,
        backgroundColor: "#4b565e"
    },
    consoleText: {
        color: "#e8e8e8",
        fontSize: 16,
        padding: 2
    },
    consoleEnter: {
        padding: 10,
        backgroundColor: "#aeb8c2"
    },
    responseLog: {
        color: "#FFF"
    },
    errorLog: {
        backgroundColor: "#de2316"
    },
    warnLog: {
        backgroundColor: "#de980b"
    }
  });