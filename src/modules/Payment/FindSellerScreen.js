import React, { Component } from 'react';
import { Input, Item, Label } from 'native-base';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { withNavigationFocus } from "react-navigation";

import ValidationComponent from 'react-native-form-validator';

import Api from "../../../Api";
import ApiTransaction from "../../../ApiTransaction";

class App extends ValidationComponent {
	constructor(props) {
		super(props);
		this.deviceLocale = 'es';
		
		this.state = {
		  id: "",
		  connected: false,
		  verified: false,
		  isLoading: true
		};
		
		this._onPressButton = this._onPressButton.bind(this);
	}
	
	async componentDidMount() {
		
		this.focusListener = this.props.navigation.addListener("focus", () => {
		  // The screen is focused
		  // Call any action
		  console.log("Hice click focus");
		  this.getUpholdStatus();
		});
	}
	
	/*componentDidUpdate(prevProps) {
		console.log(this.state.intent);
		if (this.props.isFocused && prevProps.isFocused !== this.props.isFocused) {
			this.getUpholdStatus();
		}
	}*/
	
	componentWillUnmount() {
		//this.focusListener.remove();
		console.log("removing");
	}
	
	async getUpholdStatus() {
		try {
			let userToken = await AsyncStorage.getItem('userToken');
			let response = await ApiTransaction.getUpholdDetails(userToken);
			
			if (response.status==404) {
				console.log("User no conectado a Uphold");
				this.setState({ connected: false, verified: false, isLoading: false, id: "" });
			} else {
				const result = await response.json();
				if (result.connected!=null && result.status_code==null && result.detail==null) {
					console.log("getUpholdDetails: "+result.last_updated+" "+result.connected+" "+result.verified);
					this.setState({ connected: result.connected,  verified: result.verified, isLoading: false, id: "" });
				} else {
					Alert.alert(result.detail);
				}
			}
			
		} catch (e) {
			//Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.", this.props.navigation.navigate("Profile"));
			console.log(e);
		}
	}
	
	_onPressButton() {
		let isValid = this.isValid();
		
		if (isValid) {	
			this.props.navigation.navigate('SellerData', { id: this.state.id })
		}
	}
	
	isValid () {
		return this.validate({
		  id: {required: true, numbers: true}
		});
	}
	
	render() {
		let { id, connected, verified, isLoading } = this.state;
		let link;
	  
		if (!isLoading) {
			if (!connected || !verified) {
				return (
					<View style={{ flex: 1, alignItems: 'center', backgroundColor: "white", justifyContent: 'center' }}>
						<Text>Su cuenta no está asociada a una cuenta de Uphold verificada.</Text>
						<Text>Asocie una cuenta verificada para poder efectuar pagos</Text>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { screen: 'Uphold' }) } >
							<Text style={styles.underLineText}>Revisar</Text>
						</TouchableOpacity>
					</View>
				);
			} else {
				return (
					<View style={{ flex: 1, alignItems: 'center', backgroundColor: "white", justifyContent: 'center' }}>
					  <Text style={{ fontSize: 17, color: 'grey', textAlign: 'center', margin : 20, padding : 10 }}>Por favor ingrese el Id del comercio o escanee el código QR</Text>
					  
					  <Item floatingLabel last>
						<Label>Identificador del comercio</Label>
						<Input value={id} onChangeText={ (id) => this.setState({ id }) } />
					  </Item>
					  {this.isFieldInError('id') && this.getErrorsInField('id').map((errorMessage, i) => <Text style={{color: "red"}} key={i}>{errorMessage}</Text>) }		
					  <TouchableOpacity onPress={() => this.props.navigation.navigate("QRreader") } >
						<Text style={styles.underLineText}>Escanear QR</Text>
					  </TouchableOpacity>
					  <TouchableOpacity style={styles.button} onPress={this._onPressButton} >
						<Text style={styles.buttonText} >Siguiente</Text>
					  </TouchableOpacity>
					</View>
				);
			}
		} else {
			return (<View style={{ flex: 1, alignItems: 'center', backgroundColor: "white", justifyContent: 'center'  }}><Text>Cargando...</Text></View>);
		} 
	}
}

export default App;

const styles = StyleSheet.create({
	underLineText: {
		textDecorationLine: 'underline',
		color: 'blue',
		fontSize: 15,
		padding: 10,
		margin: 20,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	button: {
		alignItems: "center",
		alignSelf: "center",
		backgroundColor: "#AFC037",
		margin: 20,
		borderRadius: 50,
		padding: 10
	},
	buttonText: {
		fontWeight: "bold",
		color: "white",
		padding: 10,
		fontSize: 15
	}
});