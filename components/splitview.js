import React, { useState } from 'react';
import { StyleSheet, Text, View, NativeSyntheticEvent, Animated, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import { PanGestureHandler, State, ScrollView } from "react-native-gesture-handler";
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class SplitView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            left: {
                showing: true,
                width: windowWidth / 4
            },
            right: {
                showing: true
            },
            bottom: {
                showing: false,
                height: windowHeight - (windowHeight / 4)
            },
            fileBrowser: {
                showing: true,
                width: 250
            },
            devToolsOpen: false,
            isMovingLowerBar: false,
            isMovingLeftBar: false
        }

    }

    render() {
        return(
            <View style={styles.container}>
                <View style={{padding: 8, backgroundColor: "#576878", width: 60, alignItems: 'center'}}>
                {!this.state.isFullPreview && 
                  <Icon style={{marginBottom: 15}} onPress={() => this.setState({fileBrowser: { showing: !this.state.fileBrowser.showing, width: this.state.fileBrowser.width }})} name="folder" size={30} color={this.state.fileBrowser.showing ? "#e8e8e8" : "#d4d4d4"} />}

                    <Icon style={{marginBottom: 15}} onPress={() => {
                        if(!this.state.isFullPreview) {
                            this.setState({isFullPreview: true})
                            this.setState({fileBrowser: { showing: false, width: this.state.fileBrowser.width}, left: {showing: false, width: this.state.left.width}, bottom: {showing: false, height: this.state.bottom.height}})
                        } else {
                            this.setState({isFullPreview: false})
                            this.setState({fileBrowser: { showing: false, width: this.state.fileBrowser.width}, left: {showing: true, width: this.state.left.width}, bottom: {showing: false, height: this.state.bottom.height}})
                        }
                    }} name={!this.state.isFullPreview ? "web" : "arrow-back" } size={30} color="#e8e8e8" />

                    <Icon style={{marginBottom: 15}} onPress={() => this.setState({devToolsOpen: !this.state.devToolsOpen})} name="developer-mode" size={30} color={this.state.isFullPreview ? "#e8e8e8" : "#d4d4d4"}></Icon>

                    {!this.state.isFullPreview && <Icon style={{marginBottom: 15}} onPress={() => this.setState({bottom: { showing: !this.state.bottom.showing, height: this.state.bottom.height }})} name="developer-board" size={30} color={this.state.isFullPreview ? "#e8e8e8" : "#d4d4d4"}></Icon>}
                </View>

                {this.state.fileBrowser.showing && <View style={{width: this.state.fileBrowser.width, flexDirection: "row", justifyContent: "space-between"}}>
                    {this.props.children[3]}
                    <View style={styles.fileBar} onTouchMove={(e) => {
                        if(e.nativeEvent.pageX - 60 > 25) {
                            this.setState({
                                fileBrowser: {
                                    showing: true,
                                    width: e.nativeEvent.pageX - 60
                                }
                            }) 
                        }
                    } 
                    }/>
                </View>}

                <View style={{flex:1,flexDirection: "column"}}>
                    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={68} style={[styles.codeArea, {height: this.state.bottom.showing ? this.state.bottom.height - 25 - 45 : '100%', position: 'relative'}]}>
                        {this.state.left.showing && <View style={[styles.leftPane, {width: this.state.left.width}]}> 
                        {this.props.children[0]} 
                        </View>}
                        {this.state.left.showing && <View style={[styles.slider, {left: this.state.left.width - 5, opacity: this.state.isMovingLeftBar ? .5 : 0}]} onTouchStart={() => this.setState({isMovingLeftBar: true})} onTouchEnd={() => this.setState({isMovingLeftBar: false})} onTouchMove={(e) => {
                                if(e.nativeEvent.pageX - 60 - (this.state.fileBrowser.showing == true ? this.state.fileBrowser.width : 0) > 0) {
                                    this.setState({
                                        left: {
                                            showing: true,
                                            width: e.nativeEvent.pageX - 60 - (this.state.fileBrowser.showing == true ? this.state.fileBrowser.width : 0)
                                        }
                                    }) 
                                }
                            } 
                            }/>}
                        {this.state.right && React.cloneElement(this.props.children[1], {devToolsOpen: this.state.devToolsOpen})}
                    </KeyboardAvoidingView>
                    {this.state.bottom.showing && <View style={[styles.lowerPane, {position: 'relative'}]}>
                        <View style={[styles.lowerBar, {top: -5, opacity: this.state.isMovingLowerBar ? .5 : 0}]} onTouchStart={() => this.setState({isMovingLowerBar: true})} onTouchEnd={() => this.setState({isMovingLowerBar: false})} onTouchMove={(e) => {
                                this.setState({
                                    bottom: {
                                        showing: true,
                                        height: e.nativeEvent.pageY
                                    }
                                }) 
                            } 
                            }/>

                        {this.props.children[2]}
                    </View>}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: "#252c33",
      color: "#f0f0f0"
    },
    codeArea: {
        flexDirection: 'row',
    },
    slider: {
        height: "100%",
        backgroundColor: "#697785",
        width: 10,
        position: 'absolute',
        zIndex: 10,
        opacity: 0,
        backgroundColor: '#000'
    },
    leftPane: {
        // width: this.state.
    },
    lowerPane: {
        flexDirection: 'column'
    }, 
    lowerBar: {
        height: 10,
        position: 'absolute',
        opacity: 0,
        width: '100%',
        zIndex: 15,
        backgroundColor: '#000'
    },
    fileBar: {
        height: '100%',
        backgroundColor: "#697785",
        width: 5
    }
  });