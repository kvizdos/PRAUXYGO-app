import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TouchableWithoutFeedback, Modal, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import { Input, CheckBox, Button } from 'react-native-elements'
import { hasFeatureFlag } from '../helpers/permissions';
import { makeRequest, CREATENETWORKURL } from '../helpers/networking';

export default class Projects extends React.Component {
    constructor() {
      super();
      this.state = {
          modalVisibile: false,
        projects: [],
        projectType: "static",
        projectName: "",
        requireProjectName: false,
        releaseNotes: [{
            title: "v0.0.1",
            message: "First alpha version of PRAUXY GO. Minimal features.",
            features: [
                "Basic IDE",
                "Developer Tools"
            ]
        }],
        permissions: {}
      }
    }

    renderReleaseNote({item, index}) {
        return <View key={item.title}>
            <Text style={{fontSize: 21, fontWeight: "500"}}>{item.title}</Text>
            {item.message && <Text style={{fontSize: 18}}>{item.message}</Text>}
            <FlatList data={item.features} keyExtractor={item => item} listKey={index} renderItem={({item}) => <Text listKey={item.title} style={{fontSize: 18}}>{`\u2022 ${item}`}</Text>} /> 
        </View>
    }

    renderProject = ({item}) => {
        return <TouchableOpacity onPress={() => this.props.navigation.navigate('Code', { id: item.id, previewURL: CREATENETWORKURL(item.id) })} key={item.id} style={{padding: 5, borderBottomWidth: 2, borderColor: "#cccccc"}}>
            <Text style={{fontSize: 18}}>{item.name} {item.id}</Text>
        </TouchableOpacity>
    }

    createProject = async () => {
        if(this.state.projectName == "") {
            this.setState({requireProjectName: true});
            return;
        }

        makeRequest("/projects/new", {
            method: "POST",
            headers: {
                Accept: "application/json",
                'Content-Type': "application/json",
                Authorization: `Bearer ${await AsyncStorage.getItem("@UserInfo:username")}:${await AsyncStorage.getItem("@UserInfo:token")}`
            },
            body: JSON.stringify({
                name: this.state.projectName,
                type: this.state.projectType
            }),
        }, "https://api.go.prauxy.app").then(r => {
            this.setState({projects: [{
                name: this.state.projectName,
                type: this.state.projectType,
                id: r.id
            }], modalVisibile: false});
        }).catch(e => console.log(e))
    }

    async componentDidMount() {
        this.setState({projects: JSON.parse(await AsyncStorage.getItem("@UserInfo:projects"))})
    }

    render() {
        return (
        <View style={styles.container}>
            <Modal animationType="fade" transparent={true} visible={this.state.modalVisibile}>
                <KeyboardAvoidingView behavior="padding" style={[styles.container]}>
                    <TouchableOpacity activeOpacity={1} onPress={() => this.setState({modalVisibile: false})} style={{position: 'absolute', top: 0, left: 0, width: "100%", height: "100%", flex: 1, backgroundColor: "rgba(0,0,0,.5)"}} />
                    {hasFeatureFlag("projectCap") == -1 || hasFeatureFlag("projectCap") >= this.state.projects.length ? <View style={{width: "50%", backgroundColor: "#FFF", padding: 10, borderRadius: 5}}>
                        <Input autoCompleteType="off" autoCorrect={false} label="Project Name" placeholder="Portfolio" value={this.state.projectName} onChangeText={text => {this.setState({projectName: text,requireProjectName: false});}} errorMessage={this.state.requireProjectName ? "Project name is required" : undefined} />

                        <Text style={{fontWeight: "500", fontSize: 18, paddingLeft: 10, marginBottom: 10}}>Project Type</Text>

                        <CheckBox
                        containerStyle={{backgroundColor: "unset", borderWidth: 0, padding: 0}}
                        title='Static/blank'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={this.state.projectType == "static"}
                        onPress={() => this.setState({projectType: "static"})}
                        />
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <CheckBox
                            containerStyle={{backgroundColor: "unset", borderWidth: 0, padding: 0, opacity: hasFeatureFlag("terminal") ? 1 : .5}}
                            title="NodeJS"
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={this.state.projectType == "nodejs"}
                            onPress={() => this.setState({projectType: "nodejs"})}
                            disabled={!hasFeatureFlag("terminal")}
                            />
                            {!hasFeatureFlag("terminal") && <Text><Text style={{color: "#44a1e3"}}>PRO</Text> only feature</Text>}
                        </View>

                        <Button
                        containerStyle={{marginTop: 10}}
                        buttonStyle={{backgroundColor: "#11cf75"}}
                        title='SETUP' 
                        onPress={this.createProject}/>
                    </View> : <View style={{width: "50%", backgroundColor: "#FFF", padding: 10, borderRadius: 5}}>
                        <Text style={{fontSize: 21, textAlign: 'center'}}>You've hit your project cap! You can either delete existing projects or upgrade plans.</Text>
                        </View>}
                </KeyboardAvoidingView>
            </Modal>
            <View style={styles.innerContainer}>
                <FlatList style={{flex: 1}} data={this.state.releaseNotes} keyExtractor={(item, index) => item.title} renderItem={this.renderReleaseNote}/>
                <View style={{alignItems: "flex-start", flex: 1}}>
                    <View style={{width: "100%", alignItems: "center", justifyContent: "space-between", flexDirection: "row"}}>
                        <Text style={{fontSize: 21, fontWeight: "500"}}>Projects</Text>
                        <TouchableOpacity style={{padding: 10, backgroundColor: "#43d185", borderRadius: 5}} onPress={() => this.setState({modalVisibile: true})}>
                            <Text style={{color: "#FFF"}}>Create a project</Text>
                        </TouchableOpacity>
                    </View>

                    {this.state.projects.length != null && this.state.projects.length > 0 ? 
                    <FlatList style={{flex: 1, width: "100%"}} data={this.state.projects} keyExtractor={(item, index) => item.name} renderItem={this.renderProject}/>
                    : <Text style={{fontSize: 18}}>No projects.</Text>}
                </View>
            </View>
        </View>
        );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center'
  },
  innerContainer: {
      width: "65%",
      flex: .65,
      flexDirection: "row",
  }
});