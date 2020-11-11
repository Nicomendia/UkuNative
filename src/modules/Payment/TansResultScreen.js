import React, { Component } from 'react';
import { Container, Header, Content, Form, Input, Picker, Item, Label } from 'native-base';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, Button } from "react-native";
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome';

import ValidationComponent from 'react-native-form-validator';

import ApiTransaction from "../../../ApiTransaction";

export default class App extends ValidationComponent {
	constructor(props) {
		super(props);
		this.deviceLocale = 'es';
		
		this.state = {
		  sellerId: this.props.route.params.sellerId,
		  sellerName: this.props.route.params.sellerName,
		  address: this.props.route.params.sellerAddress,
		  amount: this.props.route.params.amount,
		  isLoading: true,
		  isOk: false,
		  selectedCard: this.props.route.params.selectedCard,
		  status: "Cargando...",
		  transactionId: "Cargando..."
		};
		
		this._onPressButton = this._onPressButton.bind(this);
	}
	
	async componentDidMount() {
		try {
			let userToken = await AsyncStorage.getItem('userToken');
			let response = await ApiTransaction.createTransaction(userToken, "Pago mediante UKU", this.state.amount, this.state.sellerId, this.state.selectedCard);
			
			console.log("Hacer pago: token "+userToken+", monto "+this.state.amount+", sellerid "+this.state.sellerId+", card "+this.state.selectedCard);
			console.log(response);

			if (response.id!=null && response.status_code==null && response.detail==null) {
				
				if (response.status!="failed") {
					this.props.navigation.addListener('beforeRemove', (e) => {
						e.preventDefault();
						
						Alert.alert(
						  'Seguro desea salir de esta pantalla?',
						  '',
						  [
							{ text: "Cancelar", style: 'cancel', onPress: () => {} },
							{
							  text: 'Salir',
							  style: 'destructive',
							  onPress: () => this.props.navigation.dispatch( CommonActions.navigate({ name: 'Home', params: {} }) ),
							},
						  ]
						);
					});
				}
				
				this.setState({ isLoading: false, isOk: true, status: response.status, transactionId: response.id });
				
			} else {
				Alert.alert(response.detail);
			}
		} catch (e) {
			Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.", this.props.navigation.navigate("FindSeller"));
			console.log(e);
		}
	}
	
	_onPressButton() {
		this.props.navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
	}
	
	/*isValid () {
		return this.validate({
		  amount: {required: true, numbers: true},
		  selected: {required: true},
		});
	}
	
	onValueChange(value: string) {
		this.setState({
			selected: value
		});
	}
	
	async _onPressButton() {
		let isValid = this.isValid();
		let { selected } = this.state;
		
		if (isValid && this.state.isOk && !this.state.isLoading) {
			
			//when card is selected by default (the first card loaded)
			if (selected==undefined ) {
				selected = this.state.upholdCards[0].id;
			}
			
			Alert.alert("Está seguro que desea pagar $"+Number(this.state.amount).toFixed(2)+" a "+this.state.sellerName+"?", "",
			[{text: 'Cancel', style: 'cancel'}, {text: 'OK', onPress: () =>
			this.props.navigation.navigate('TransactionResult', { sellerId: this.state.id, sellerName: this.state.sellerName, sellerAddress: this.state.address, amount: this.state.amount, selectedCard: selected })} ],
			{ cancelable: true });
			
			try {				
				let userToken = await AsyncStorage.getItem('userToken');
				let response = await ApiTransaction.createTransaction(userToken, "Pago mediante UKU", this.state.amount, this.state.id, selected);
				
				if (response.id!=null && response.status_code==null && response.detail==null) {
					//console.log("updateProfile: "+response);
					Alert.alert("Status de Pago: "+response.status);
				} else {
					Alert.alert(response.detail);
				}
			} catch (error) {
				Alert.alert("En estos momentos no podemos procesar su solicitud. Por favor intente más tarde");
				console.log(error);
				return false;
			}
		}
	}*/
	
  render() {
	let { sellerId, sellerName, address, selectedCard, amount, isLoading, status, transactionId } = this.state;
	let text, image, total, detail, button;
	
	if (isLoading) {
		text = <Text style={styles.bigText} >Cargando...</Text>;
	} else {
		button =
					<TouchableOpacity style={styles.button} onPress={this._onPressButton} >
					  <Text style={styles.buttonText} >Finalizar</Text>
					</TouchableOpacity>;
					
		
					
		if (status=="completed") {
			text = <Text style={styles.bigText} >Pago exitoso!</Text>;
			image = <Icon name='check' color={'#67A254'} size={80} style={styles.icons} />;
			total = <Text style={styles.amount} >${Number(amount).toFixed(2)}</Text>;
			detail = <Text>Id transacción: {transactionId}</Text>;
		} else if (status=="failed") {
			text = <Text style={styles.bigText} >El pago falló!</Text>;
			image = <Icon name='close' color={'red'} size={80} style={styles.icons} />;
		} else {
			text = <Text style={styles.bigText} >{status}!</Text>;
			total = <Text style={styles.amount} >${Number(amount).toFixed(2)}</Text>;
			detail = <Text>Id transacción: {transactionId}</Text>;
		}
	}
	  
    return (
		<Container>
				<Content>
				  <Form>
					<Label style={{marginTop: 15, marginLeft: 15, color: "grey"}}>Datos del comercio</Label>
					<View style={styles.readOnly}>
						<Text style={styles.text}>Nombre: {sellerName+"\n"}Dirección: {address+"\n"}Id comercio: {sellerId}</Text>
					</View>
					<Label style={{marginTop: 15, marginLeft: 15, color: "grey"}}>Datos de la operación</Label>
					<View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} >
						{text}
						{image}
						{total}
						{detail}
						{button}
					</View>
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
	width: 100,
	height: 100
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
  bigText: {
    flex: 1,
	marginTop: 20,
    paddingTop: 20,
    paddingRight: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    color: '#424242',
	fontSize: 25
  },
  amount: {
	color: '#424242',
	fontSize: 20
  }
});