import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SplitView from '../components/splitview';
import Editor from '../components/editor';
import Terminal from '../components/terminal';
import WebPreview from '../components/preview';
import FileBrowser from '../components/filebrowser';

export default class CodeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      files: [],
      openedTabs: [{file: "none", contents: "No file opened"}],
      folders: []
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

  componentDidMount() {
    const _this = this;
    fetch("http://192.168.86.48:8080/prauxyapi")
    .then((resp) => resp.json())
    .then(files => {
      const folders = this.createFolderStateStructure(JSON.parse(JSON.stringify(files)));
      // console.log(folders)
      this.setState({files: JSON.parse(JSON.stringify(files)), folders: folders})
    })
  }

    openFile = (file) => {
      if(this.state.openedTabs.findIndex(i => i.file == file.file) == -1) {
        this.setState({
          openedTabs: [...this.state.openedTabs, file]
        }, () => {
          // console.log(this.state.openedTabs)
        })
      }
    }

    closeFile = (file) => {      
      this.setState({
        openedTabs: this.state.openedTabs.filter(i => i.file != file)
      })
    }

    render() {
      return (
      <View style={styles.container}>
        <View style={{height: 24, backgroundColor: "#303aa1"}}></View>
        <SplitView>
          <Editor openedTabs={this.state.openedTabs} closeFile={this.closeFile}></Editor>
          <WebPreview previewURL="http://192.168.86.48:8080"></WebPreview>
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