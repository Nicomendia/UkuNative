import React, { Component } from 'react';
import { Input, Item, Label } from 'native-base';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';

import ValidationComponent from 'react-native-form-validator';

import Api from "../../../Api";

export default class App extends ValidationComponent {
	constructor(props) {
		super(props);
		this.deviceLocale = 'es';
		
		this.state = {
		  email: ""
		};
		
		this._onPressButton = this._onPressButton.bind(this);
	}
	
	async _onPressButton() {
		let isValid = this.isValid();
		
		if (isValid) {	
			try {	
				let response = await Api.forgotPassword(this.state.email);
				
				if (response.status==200) {
					console.log("Enviado a correo");
					Alert.alert("Revise su bandeja de correo para recuperar su cuenta");
				} else {
					const json = await response.json();
					if(json.status_code!=null && json.detail!=null) {
						Alert.alert(json.detail);
						console.log("Fallo de recuperacion password");
					}
				}
			} catch (error) {
				Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.");
				console.log(error);
				return false;
			}
		}
	}
	
	isValid () {
		return this.validate({
		  email: {email: true, required: true}
		});
	}
	
	render() {
		let { email } = this.state;
		
	  return (
		<View style={{ flex: 1, alignItems: 'center', backgroundColor: "white", justifyContent: 'center' }}>
		  <Text style={{ fontSize: 20, color: 'grey', textAlign: 'center', marginBottom : 20 }}>Por favor ingrese su correo electrónico</Text>
		  
		  <Item floatingLabel last>
			<Label>Email</Label>
			<Input value={email} onChangeText={ (email) => this.setState({ email }) } />
		  </Item>
		  {this.isFieldInError('email') && this.getErrorsInField('email').map((errorMessage, i) => <Text style={{color: "red"}} key={i}>{errorMessage}</Text>) }		
		  <TouchableOpacity style={styles.button} onPress={this._onPressButton} >
			<Text style={styles.buttonText} >Recuperar</Text>
		  </TouchableOpacity>
		</View>
	  );
	}
}

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		alignSelf: "center",
		backgroundColor: "#AFC037",
		margin: 50,
		borderRadius: 50,
		padding: 10
	},
	buttonText: {
		fontWeight: "bold",
		color: "white",
		padding: 10,
		fontSize: 20
	}
});