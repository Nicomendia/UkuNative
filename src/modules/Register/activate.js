import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class App extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
	  return (
		<View style={{ flex: 1, alignItems: 'center', backgroundColor: "white", justifyContent: 'center' }}>
		  <Text style={{ fontSize: 20, textAlign: 'center' }}>Hemos enviado un correo para la activación de su cuenta</Text>
		  <Icon name='check' color={'#67A254'} size={80} style={styles.icons} />
		  <TouchableOpacity onPress={() => this.props.navigation.navigate('SignIn')} >
		     <Text style={styles.underLineText}>Salir</Text>
		  </TouchableOpacity>
		</View>
	  );
	}
}

const styles = StyleSheet.create({
  underLineText: {
    textDecorationLine: 'underline',
    color: 'blue',
	fontSize: 15,
	padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icons: {
	textAlign: 'center',
    textAlignVertical: 'center',
	marginTop: 20,
	width: 100,
	height: 100
  }
});