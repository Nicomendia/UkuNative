import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableHighlight
} from 'react-native';

const simpleNotify = props => {
  const {
    visible,
	message,
	handleNotify,
    ...attributes
  } = props;

	return (
			<Modal animationType="slide" transparent={true} visible={visible}>
			  <View style={styles.centeredView}>
				<View style={styles.modalView}>
				  <Text style={styles.modalText}>{message}</Text>

				  <TouchableHighlight
					style={{ ...styles.openButton, backgroundColor: "#AFC037" }}
					onPress={() => {
					  handleNotify( false, "" );
					}}
				  >
					<Text style={styles.textStyle}>Aceptar</Text>
				  </TouchableHighlight>
				</View>
			  </View>
			</Modal>
	);
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

export default simpleNotify;