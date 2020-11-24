import React, { Component } from "react";
import { Alert, StyleSheet, Text, TouchableHighlight, View } from "react-native";

import SimpleNotify from './simpleNotify';

class App extends Component {
  state = {
    visible: false,
	message: ""
  };
  
	handleNotify = (visible, message) => {
		this.setState({visible: visible, message: message});
	}

  render() {
    let { visible, message } = this.state;
    return (
      <View style={styles.centeredView}>
        <SimpleNotify visible={visible} message={message} handleNotify={this.handleNotify} />

        <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            this.setState({ visible: true, message: "En estos momentos no podemos procesar su solicitud. Por favor intente más tarde." });
          }}
        >
          <Text style={styles.textStyle}>Show Modal</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default App;