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
		  key: this.props.route.params.key,
		  password1: "",
		  password2: ""
		};
		
		this._onPressButton = this._onPressButton.bind(this);
	}
	
	async _onPressButton() {
		let isValid = this.isValid();
		
		if (isValid) {	
			try {	
				let response = await Api.resetPassword(this.state.key, this.state.password1, this.state.password2);
				
				if (response.status==200) {
					console.log("Password reset success");
					Alert.alert("Muy bien!","Su password ha sido modificado exitosamente.", this.props.navigation.navigate("SignIn"));
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
		  key: {required: true},
		  password1: {minlength:8, required: true},
		  password2: {minlength:8, required: true, equalPassword : this.state.password1}
		});
	}
	
	render() {
		let { key, password1, password2 } = this.state;
		
	  return (
		<View style={{ flex: 1, alignItems: 'center', backgroundColor: "white", justifyContent: 'center' }}>
		  <Text style={{ fontSize: 20, color: 'grey', textAlign: 'center', marginBottom : 20 }}>Por favor ingrese su nuevo password</Text>
		  
		  <Item floatingLabel last>
			<Label>Password</Label>
			<Input value={password1} onChangeText={ (password1) => this.setState({ password1 }) } />
		  </Item>
		  {this.isFieldInError('password1') && this.getErrorsInField('password1').map((errorMessage, i) => <Text style={{color: "red"}} key={i}>{errorMessage}</Text>) }

		  <Item floatingLabel last>
			<Label>Repita su password</Label>
			<Input value={password2} onChangeText={ (password2) => this.setState({ password2 }) } />
		  </Item>
		  {this.isFieldInError('password2') && this.getErrorsInField('password2').map((errorMessage, i) => <Text style={{color: "red"}} key={i}>{errorMessage}</Text>) }
		  
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