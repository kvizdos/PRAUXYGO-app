import React, {useState} from 'react';
import { AsyncStorage, StyleSheet, View, Text, ScrollView, TouchableHighlight, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Input, Button } from 'react-native-elements';
import { makeRequest, CREATENETWORKURL } from '../helpers/networking';

export default class FileBrowser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: this.props.files,
            folders: this.props.folders,
            newFileName: "",
            isCreatingNew: false,
            inputError: undefined,
            showCreateNew: false,
            newFileNameWriting: undefined
        }
    }

    static getDerivedStateFromProps(props, state) {
        return {
            files: props.files,
            folders: props.folders,
            openModa: props.openModal,
            newFileName: state.newFileName,
            isCreatingNew: state.isCreatingNew,
            inputError: state.inputError,
            showCreateNew: state.showCreateNew
        }
    }

    renderFolder(directory, path = "") {
        let tree = directory.map((i, key) => {
            if(i.type == "file") {
                return (<TouchableHighlight key={key} style={{padding: 3}} underlayColor="transparent" onPress={() => this.props.openFile(i)}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Icon name="description" size={18} color="#bdbdbd" style={{marginRight: 5}}/>
                                <Text ellipsizeMode='tail' style={{fontSize: 18, color: '#FFF'}} numberOfLines={1}>{i.file.split("/").slice(-1)[0]}</Text>
                            </View>
                        </TouchableHighlight>)
            } else {
                return (<View key={key} style={{flexDirection: "column"}}>
                    <TouchableHighlight style={{padding: 3}} underlayColor="transparent" onPress={() => {
                                const loc = [...this.state.folders].findIndex(z => {
                                    return z.name == `${path}/${i.file}`
                                });

                                const newState = this.state.folders[loc].showing = !this.state.folders[loc].showing;

                                this.setState({folders: newState})
                            }}>
                        <View style={{flexDirection: "row", alignItems: "center"}} >
                            <Icon name={[...this.state.folders].findIndex(z => z.name == `${path}/${i.file}` && z.showing == true) != -1 ? "folder-open" : "folder"} size={18} color="#bdbdbd" style={{marginRight: 5}}/>
                            <Text ellipsizeMode='tail' style={{fontSize: 18, color: '#FFF'}} numberOfLines={1}>{i.file.split("/").slice(-1)[0]}</Text>
                        </View>
                    </TouchableHighlight>
                    {[...this.state.folders].findIndex(z => z.name == `${path}/${i.file}` && z.showing == true) != -1 && [...directory].find(z => {
                            return z.file == i.file
                        }).contents.length > 0 && <View style={{marginLeft: 18}}>
                        {this.renderFolder([...directory].find(z => {
                            return z.file == i.file
                        }).contents, path + "/" + i.file)}
                    </View>}
                </View>)
            }
            })

        return tree;
    }

    createNewFileFolder = async (text) => {
        const type = text.split("/").slice(-1)[0].indexOf(".") != -1 ? "file" : "folder";

        let req = {};

        req['file'] = text;

        this.setState({isCreatingNew: true, newFileNameWriting: undefined})

        makeRequest('/prauxyapi/new/' + type, {
            method: "POST",
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json",
                Authorization: `Bearer ${await AsyncStorage.getItem("@UserInfo:username")}:${await AsyncStorage.getItem("@UserInfo:token")}`
            },
            body: JSON.stringify(req)
        }, CREATENETWORKURL(this.props.id)).then(r => {
            if(r.status == "fail") {
                this.setState({inputError: r.reason});
            this.setState({isCreatingNew: false})
                return;
            }

            this.props.reloadFiles();
            this.setState({showCreateNew: false})
            this.setState({isCreatingNew: false})
        })
    }

    render() {
       return  (
            <View style={{flex: 1}}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.setState({showCreateNew: true})}>
                        <Icon name="add" size={21} style={{color: "#FFF"}} />
                    </TouchableOpacity>   
                </View>
                {this.state.showCreateNew && <View style={[styles.header, {padding: 0, backgroundColor: "#36404a"}]}>
                    <Input 
                        leftIcon={
                            <Icon
                            name={this.state.newFileNameWriting != undefined && this.state.newFileNameWriting.split("/").splice(-1)[0].indexOf(".") != -1 ? "description" : this.state.newFileNameWriting != undefined && this.state.newFileNameWriting.length > 0 ? "folder" : "help-outline"}
                            size={14}
                            color='#dedede'
                            style={{padding: 0, margin: 0}}
                            />
                        }
                        disabled={this.state.isCreatingNew} errorMessage={this.state.inputError != undefined ? this.state.inputError : undefined} errorStyle={{color: "#fc6560"}} autoCorrect={false} onSubmitEditing={(text) => this.createNewFileFolder(text.nativeEvent.text)} placeholder="Folder or file name" placeholderTextColor="#dedede" onChangeText={(text) => this.setState({newFileNameWriting: text})} inputStyle={{color: "#FFF", fontSize: 14, padding: 0, margin: 0}} /> 
                </View>}
                <ScrollView horizontal={true}>
                    <ScrollView>
                        {this.renderFolder([...this.state.files])}
                    </ScrollView>
                </ScrollView>
            </View>
       )
    }
}

const styles = StyleSheet.create({
    header: {
        padding: 5,
        backgroundColor: "#5c6b7a",
        width: "100%"
    }
})