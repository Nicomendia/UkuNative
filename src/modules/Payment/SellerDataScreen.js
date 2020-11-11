import React, { Component } from 'react';
import { Container, Header, Content, Form, Input, Item, Label } from 'native-base';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, Button } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome';

import ValidationComponent from 'react-native-form-validator';

import ApiTransaction from "../../../ApiTransaction";

export default class App extends ValidationComponent {
	constructor(props) {
		super(props);
		this.deviceLocale = 'es';
		
		this.state = {
		  id: this.props.route.params.id,
		  sellerName: "Cargando...",
		  category: "Cargando...",
		  address: "Cargando...",
		  isLoading: true,
		  isOk: false
		};
		
		this._onPressButton = this._onPressButton.bind(this);
	}
	
	async componentDidMount() {
		try {
			let userToken = await AsyncStorage.getItem('userToken');
			let result = await ApiTransaction.getCompanyById(this.state.id, userToken);
			if (result[0]!=null && result.status_code==null && result.detail==null) {
				console.log("seller data: "+result[0].name+" "+result[0].address+" "+result[0].categories[0].name);
				this.setState({ sellerName: result[0].name, category: result[0].categories[0].name, address: result[0].address, isLoading: false, isOk: true });
			} else if (result.status_code!=null && result.detail!=null){
				Alert.alert(result.detail);
			} else {
				this.setState({ sellerName: "Vendedor no encontrado", category: "Vendedor no encontrado", address: "Vendedor no encontrado", isLoading: false });
				Alert.alert("No existe vendedor asociado con el código introducido", this.props.navigation.navigate("FindSeller"));
			}
		} catch (e) {
			Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.", this.props.navigation.navigate("FindSeller"));
			console.log(e);
		}
	}
	
	_onPressButton() {
		if (this.state.isOk && !this.state.isLoading) {
			console.log("pagar a "+this.state.sellerName);
			this.props.navigation.navigate('TransactionData', { sellerId: this.state.id, sellerName: this.state.sellerName, sellerAddress: this.state.address });
		}
	}
	
  render() {
	let { id, sellerName, category, address, isLoading } = this.state;
	  
    return (
		<Container>
				<Content>
				  <Form>
					<Label style={{marginTop: 15, marginLeft: 15, color: "grey"}}>Nombre del comercio</Label>
					<View style={styles.readOnly}>
						<Text style={styles.text}>{sellerName}</Text>
					</View>
					<Label style={{marginTop: 15, marginLeft: 15, color: "grey"}}>Categoría</Label>
					<View style={styles.readOnly}>
						<Text style={styles.text}>{category}</Text>
					</View>
					<Label style={{marginTop: 15, marginLeft: 15, color: "grey"}}>Localidad</Label>
					<View style={styles.readOnly}>
						<Text style={styles.text}>{address}</Text>
					</View>
					<Label style={{marginTop: 15, marginLeft: 15, color: "grey"}}>Identificador</Label>
					<View style={styles.readOnly}>
						<Text style={styles.text}>{id}</Text>
					</View>
					
					<TouchableOpacity style={styles.button} onPress={this._onPressButton} >
					  <Text style={styles.buttonText} >Siguiente</Text>
					</TouchableOpacity>
				  </Form>
				</Content>
		</Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
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