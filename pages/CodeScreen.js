import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import SplitView from '../components/splitview';
import Editor from '../components/editor';
import Terminal from '../components/terminal';
import WebPreview from '../components/preview';
import FileBrowser from '../components/filebrowser';
import { makeRequest, DEFAULTNETWORKINGURL, CREATENETWORKURL } from '../helpers/networking';

export default class CodeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      files: [],
      openedTabs: [{file: "none", contents: "No file opened"}],
      folders: [],
      updatedFiles: []
    }
  }

  createFolderStateStructure(directory, path = "", folders = [], i = 0) {
    const dir = directory.shift();
    if(dir != undefined && dir.type != "file") {
      folders.push({name: path + "/" + dir.file, showing: false});
      folders.push(...this.createFolderStateStructure(dir.contents, path + "/" + dir.file, [], i++));
    }

    if(directory.length > 0) {
      i++;
      return this.createFolderStateStructure(directory, path, folders, i);
    } else {
      return folders;
    }
  }

  async componentDidMount() {
    makeRequest("/prauxyapi", {
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem("@UserInfo:username")}:${await AsyncStorage.getItem("@UserInfo:token")}`
      }
    }, CREATENETWORKURL(this.props.route.params.id))
    .then(files => {
      const folders = this.createFolderStateStructure(JSON.parse(JSON.stringify(files)));
      
      this.setState({files: JSON.parse(JSON.stringify(files)), folders: folders})
    })
  }

    openFile = (file) => {
      if(this.state.openedTabs.findIndex(i => i.file == file.file) == -1) {
        this.setState({
          openedTabs: [...this.state.openedTabs, file]
        })
      }
    }

    closeFile = (file, reset = false) => {   
      this.setState({
        openedTabs: this.state.openedTabs.filter(i => i.file != file)
      })
    }

    changeFile = (file, text) => {
      if(this.state.updatedFiles.findIndex(i => i == file) == -1) {
        this.setState({updatedFiles: [file, ...this.state.updatedFiles]});
      }

      if(text != undefined) this.updateFile(file, text)
    }

    removeFromChangelist = (file) => {
      this.setState({updatedFiles: this.state.updatedFiles.filter(i => i != file)});
    }

    getChangedFiles = () => {
      return this.state.updatedFiles;
    }

    updateFileAtPath = (arr, file, path = "", setTo) => {
      // console.log("Starting " + file)
      if(path == "") path = file.split("/")[0];

      return arr.map(value => {
          if(value.type == "folder") {
            if(value.file.split("/").slice(-1) == path.split("/")[0]) {
              value.contents = this.updateFileAtPath(value.contents, file, file.split("/").slice(1).join("/"), setTo);
            }
            return value;
          }

          if(value.file == file) {
            return setTo;
          }
          return value;
      });
    }

    updateFile = (file, contents) => {
      let allFiles = this.state.files;
      const newFiles = this.updateFileAtPath(JSON.parse(JSON.stringify(allFiles)), file, "", {
        file: file,
        contents: contents,
        type: "file"
      });

      let newTabs = this.state.openedTabs.map(value => {
        if(value.file == file) {
          value.contents = contents;
        }
        return value;
      })

      this.setState({files: newFiles, openedTabs: newTabs})
    }

    render() {
      return (
      <View style={styles.container}>
        <SplitView>
          <Editor updateFile={this.updateFile} removeFromChangelist={this.removeFromChangelist} getChangedFiles={this.getChangedFiles} changeFile={this.changeFile} id={this.props.route.params.id} webview={this.state.webview} openedTabs={this.state.openedTabs} closeFile={this.closeFile}></Editor>
          <WebPreview setWebView={(view) => this.setState({webview: view})} previewURL={this.props.route.params.previewURL}></WebPreview>
          <Terminal></Terminal>
          <FileBrowser files={this.state.files} folders={this.state.folders} openFile={this.openFile}></FileBrowser>
        </SplitView>
      </View>
      );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});