import React, { Component } from 'react';
import { Container, Header, Content, Form, Input, Item, Label } from 'native-base';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, Button, Platform, Linking, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Icon from 'react-native-vector-icons/FontAwesome';

import ValidationComponent from 'react-native-form-validator';

import ApiTransaction from "../../../ApiTransaction";
import SimpleNotify from '../../../simpleNotify';

export default class App extends ValidationComponent {
	constructor(props) {
		super(props);
		this.deviceLocale = 'es';
		
		this.state = {
		  last_updated: "Cargando...",
		  connected: false,
		  verified: false,
		  isLoading: true,
		  visible: false,
		  message: "",
		  redirect: false
		};
		
		this._onPressButtonDisconnect = this._onPressButtonDisconnect.bind(this);
		this._onPressButtonConnect = this._onPressButtonConnect.bind(this);
		this._onPressButtonUpdate = this._onPressButtonUpdate.bind(this);
	}
	
	handleNotify = (visible, message) => {
		this.setState({visible: visible, message: message});
	}
	
	componentDidUpdate(prevProps, prevState) {
	  if(prevState.visible && !this.state.visible && this.state.redirect){
		  console.log("redirigiendo");
		  this.props.navigation.navigate("Profile");
	  }
	}
	
	async componentDidMount() {
		this.focusListener = this.props.navigation.addListener("focus", () => {
		  // The screen is focused
		  console.log("llegue a UpholdScreen otra vez");
		  this.setState({ 
			last_updated: "Cargando...",
		    connected: false,
		    verified: false,
		    isLoading: true
		  });
		  this.refresh();
		});
	}

	async refresh() {
		try {
			let userToken = await AsyncStorage.getItem('userToken');
			let response = await ApiTransaction.getUpholdDetails(userToken);
			
			if (response.status==404) {
				console.log("User no conectado a Uphold");
				this.setState({ last_updated: "N/A", connected: false, verified: false, isLoading: false });
			} else {
				const result = await response.json();
				if (result.last_updated!=null && result.status_code==null && result.detail==null) {
					console.log("getUpholdDetails: "+result.last_updated+" "+result.connected+" "+result.verified);
					this.setState({ last_updated: result.last_updated, connected: result.connected, verified: result.verified, isLoading: false });
				} else {
					//Alert.alert(result.detail);
					this.setState({ visible: true, message: result.detail });
				}
			}			
		} catch (e) {
			//Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.", this.props.navigation.navigate("Profile"));
			this.setState({ visible: true, message: "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.", redirect: true });
			console.log(e);
		}
	}
	
	async _onPressButtonDisconnect() {
		if (!this.state.isLoading) {
			try {	
				let userToken = await AsyncStorage.getItem('userToken');
				let response = await ApiTransaction.disconnectUphold(userToken);
				
				if (response.status==202) {
					console.log("Uphold desconectado");
					this.setState({ last_updated: "N/A", connected: false, verified: false, visible: true, message: "Su cuenta ya no se encuentra asociada a Uphold" });
					//Alert.alert("Su cuenta ya no se encuentra asociada a Uphold");
				} else {
					const json = await response.json();
					if(json.status_code!=null && json.detail!=null) {
						//Alert.alert(json.detail);
						console.log("Fallo en desconeccion de Uphold");
						this.setState({ visible: true, message: json.detail });
					}
				}
			} catch (error) {
				//Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.");
				console.log(error);
				this.setState({ visible: true, message: "En estos momentos no podemos procesar su solicitud. Por favor intente más tarde." });
				return false;
			}
		}
	}
	
	async _onPressButtonConnect() {
		this.props.navigation.navigate("UpholdConnect");
	}
	
	async _onPressButtonUpdate() {
		if (!this.state.isLoading) {
			try {	
				let userToken = await AsyncStorage.getItem('userToken');
				let response = await ApiTransaction.putUpholdDetails(userToken);
				
				const result = await response.json();
				if(result.status_code!=null && result.detail!=null) {
					//Alert.alert(result.detail);
					console.log("Fallo en verificación de Uphold");
					this.setState({ visible: true, message: result.detail });
				} else {
					console.log("getUpholdDetails: "+result.last_updated+" "+result.connected+" "+result.verified);
					this.setState({ last_updated: result.last_updated, connected: result.connected, verified: result.verified, isLoading: false });
				}
				
				/*
				
				PROBAR HACER LLAMADO CON UN TOKEN QUE NO ESTE CONECTADO A VER QUE PASA
				
				
				if (response.status==202) {
					console.log("Status de Uphold actualizado");
					this.setState({ last_updated: "N/A" });
					this.setState({ connected: "N/A" });
					this.setState({ verified: "N/A" });
					this.setState({ isConected: false });
					Alert.alert("Su cuenta ya no se encuentra asociada a Uphold");
				} else {
					const json = await response.json();
					if(json.status_code!=null && json.detail!=null) {
						Alert.alert(json.detail);
						console.log("Fallo en desconeccion de Uphold");
					}
				}*/
			} catch (error) {
				//Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.");
				console.log(error);
				this.setState({ visible: true, message: "En estos momentos no podemos procesar su solicitud. Por favor intente más tarde." });
				return false;
			}
		}
	}
	
  render() {
	let { last_updated, connected, verified, isLoading } = this.state;
	let button, text, warning;
	
	if (!isLoading) {
		if (connected) {
			text = "Deseas desconectar tu cuenta de Uphold?";
			button =
				<View>
					<TouchableOpacity style={styles.buttonRed} onPress={ () => Alert.alert("Está seguro que desea desconectar su cuenta de Uphold?", "", [{text: 'Cancel', style: 'cancel'}, {text: 'OK', onPress: () => this._onPressButtonDisconnect()} ], { cancelable: true })} >
					  <Text style={styles.buttonText} >Desconectar{"\n"}Uphold</Text>
					</TouchableOpacity>
				</View>;
				if (!verified) {
					warning = "La cuenta de Uphold asociada no ha sido verificada aún. Por favor ingrese a Uphold, verifique su cuenta y regrese nuevamente cuando haya sido aprobada dicha verificación.";
				}
					/*<TouchableOpacity onPress={this._onPressButtonUpdate} >
					  <Text >Verificar Status Uphold</Text>
					</TouchableOpacity>
					*/
		} else {
			text = "Debe conectar una cuenta de Uphold verificada para poder efectuar transacciones con esta app.";
			button =
					<TouchableOpacity style={styles.buttonGreen} onPress={this._onPressButtonConnect} >
					  <Text style={styles.buttonText} >Conectar{"\n"}Uphold</Text>
					</TouchableOpacity>;
		}
		return (
			<Container>
					<Header style={{ backgroundColor: "#AFC037", height: 70, justifyContent: "space-around", alignItems: "center", paddingBottom: 10}} >
						<Text style={{ color: '#fff', fontSize: 25, fontWeight: "bold" }}>Vinculación Uphold</Text>
						<MaterialCommunityIcons name="menu" color={'#fff'} size={45} onPress={() => this.props.navigation.toggleDrawer()} />
					</Header>
					<Content>
					  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						  <Text style={{ fontSize: 17, color: 'red', textAlign: 'center', margin : 20, padding : 10 }}>{warning}</Text>
						  <Text style={{ fontSize: 17, color: 'grey', textAlign: 'center', margin : 20, padding : 10 }}>{text}</Text>
						  {button}
					  </View>
					</Content>
			</Container>
		);
	} else {
		return (<View style={{ flex: 1, alignItems: 'center', backgroundColor: "white", justifyContent: 'center' }}><ActivityIndicator size="large" color='#AFC037' /></View>);
	}
	
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonRed: {
    alignItems: "center",
	alignSelf: "center",
    backgroundColor: "red",
	margin: 10,
	marginTop: 30,
	borderRadius: 50,
    padding: 10
  },
  buttonGreen: {
    alignItems: "center",
	alignSelf: "center",
    backgroundColor: "#AFC037",
	margin: 10,
	marginTop: 30,
	borderRadius: 50,
    padding: 10
  },
  buttonText: {
    fontWeight: "bold",
	textAlign: "center",
	color: "white",
	padding: 10,
	fontSize: 20
  },
  icons: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  readOnly: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  checkIcon: {
    padding: 10,
  },
  text: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#F0F0F0',
    color: '#424242',
	marginLeft: 15,
  },
});