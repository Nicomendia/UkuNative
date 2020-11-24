import React, { Component } from 'react';
import { Input, Item, Label } from 'native-base';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native';

import ValidationComponent from 'react-native-form-validator';

import Api from "../../../Api";
import Loader from '../../../loader';
import SimpleNotify from '../../../simpleNotify';

export default class App extends ValidationComponent {
	constructor(props) {
		super(props);
		this.deviceLocale = 'es';
		
		this.state = {
		  email: "",
		  loading: false,
		  visible: false,
		  message: ""
		};
		
		this._onPressButton = this._onPressButton.bind(this);
	}
	
	handleNotify = (visible, message) => {
		this.setState({visible: visible, message: message});
	}
	
	async _onPressButton() {
		let isValid = this.isValid();
		
		if (isValid) {	
			try {	
				this.setState({
				  loading: true
				});
				let response = await Api.forgotPassword(this.state.email);
				
				if (response.status==200) {
					console.log("Enviado a correo");
					//Alert.alert("Revise su bandeja de correo para recuperar su cuenta");
					this.setState({ visible: true, message: "Revise su bandeja de correo para recuperar su cuenta", loading: false });
				} else {
					const json = await response.json();
					if(json.status_code!=null && json.detail!=null) {
						//Alert.alert(json.detail);
						this.setState({ visible: true, message: json.detail, loading: false });
						console.log("Fallo de recuperacion password");
					}
				}
				/*this.setState({
				  loading: false
				});*/
			} catch (error) {
				//Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.");
				this.setState({ visible: true, message: "En estos momentos no podemos procesar su solicitud. Por favor intente más tarde." });
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
		let { email, visible, message } = this.state;
		
	  return (
		<View style={{ flex: 1, alignItems: 'center', backgroundColor: "white", justifyContent: 'center' }}>
		<SimpleNotify visible={visible} message={message} handleNotify={this.handleNotify} />
		<Loader loading={this.state.loading}/>
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