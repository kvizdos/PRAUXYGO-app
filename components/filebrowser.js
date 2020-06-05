import React, {useState} from 'react';
import { View, Text, ScrollView, TouchableHighlight, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenHeight = Dimensions.get('window').height;

export default class FileBrowser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: this.props.files,
            folders: this.props.folders
        }
    }

    static getDerivedStateFromProps(props, state) {
        return {
            files: props.files,
            folders: props.folders
        }
    }

    renderFolder(directory, path = "") {
        let tree = directory.map((i, key) => {
            if(i.type == "file") {
                return (<TouchableHighlight key={key} style={{padding: 3}} underlayColor="transparent" onPress={() => this.props.openFile(i)}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Icon name="description" size={18} color="#bdbdbd" style={{marginRight: 5}}/>
                                <Text ellipsizeMode='tail' style={{fontSize: 18, color: '#FFF'}} numberOfLines={1}>{i.file}</Text>
                            </View>
                        </TouchableHighlight>)
            } else {
                return (<View key={key} style={{flexDirection: "column"}}>
                    <TouchableHighlight style={{padding: 3}} underlayColor="transparent" onPress={() => {
                                const loc = [...this.state.folders].findIndex(z => {
                                    return z.name == `${path}/${i.file}`
                                });

                                const newState = this.state.folders[loc].showing = !this.state.folders[loc].showing;

                                this.setState({folders: newState}, () => {
                                })
                            }}>
                        <View style={{flexDirection: "row", alignItems: "center"}} >
                            <Icon name={[...this.state.folders].findIndex(z => z.name == `${path}/${i.file}` && z.showing == true) != -1 ? "folder-open" : "folder"} size={18} color="#bdbdbd" style={{marginRight: 5}}/>
                            <Text ellipsizeMode='tail' style={{fontSize: 18, color: '#FFF'}} numberOfLines={1}>{i.file}</Text>
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

    render() {
       return  (
            <ScrollView horizontal={true}>
                <ScrollView>
                    {this.renderFolder([...this.state.files])}
                </ScrollView>
            </ScrollView>
       )
    }
}