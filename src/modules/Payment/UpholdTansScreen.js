import React, { Component } from 'react';
import { Container, Header, Content, Form, Input, Picker, Item, Label } from 'native-base';
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
		  id: this.props.route.params.sellerId,
		  sellerName: this.props.route.params.sellerName,
		  address: this.props.route.params.sellerAddress,
		  amount: "",
		  isLoading: true,
		  isOk: false,
		  selected: undefined,
		  upholdCards: [{"balance": "", "currency": "", "id": "1", "label":"loading..."}]
		};
		
		this._onPressButton = this._onPressButton.bind(this);
	}
	
	async componentDidMount() {
		try {
			let userToken = await AsyncStorage.getItem('userToken');
			let result = await ApiTransaction.getUpholdCards(userToken);
			
			if (result.status_code==null && result.detail==null) {
				this.setState({ isLoading: false, isOk: true, upholdCards: result });
			} else {
				Alert.alert(result.detail);
			}
		} catch (e) {
			Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.", this.props.navigation.navigate("FindSeller"));
			console.log(e);
		}
	}
	
	isValid () {
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
		}
	}
	
  render() {
	let { id, sellerName, category, address, selected, amount, isLoading } = this.state;
	  
    return (
		<Container>
				<Content>
				  <Form>
					<Label style={{marginTop: 15, marginLeft: 15, color: "grey"}}>Datos del comercio</Label>
					<View style={styles.readOnly}>
						<Text style={styles.text}>Nombre: {sellerName+"\n"}Dirección: {address+"\n"}Identificador: {id}</Text>
					</View>
					<Label style={{marginTop: 15, marginLeft: 15, color: "grey"}}>Tarjeta Uphold (origen fondos)</Label>
					<Item picker last>
						<Picker
							mode="dropdown"
							style={{ width: undefined }}
							placeholder="Seleccione su tarjeta de Uphold"
							placeholderStyle={{ color: "#bfc6ea" }}
							placeholderIconColor="#007aff"
							selectedValue={this.state.selected}
							onValueChange={(selected) => this.setState({selected: selected})}>
								{this.state.upholdCards.map((item, index) => {return <Picker.Item value={item.id} label={item.label+" $"+Number(item.balance).toFixed(2)} key={index}  /> })}
						</Picker>
					</Item>
					
					<Item floatingLabel last>
						<Label>Monto a pagar $ (Ejemplo: 10.55)</Label>
						<Input keyboardType={'numeric'} value={amount} onChangeText={ (amount) => this.setState({ amount }) } />
					</Item>
					{this.isFieldInError('amount') && this.getErrorsInField('amount').map((errorMessage, i) => <Text style={{color: "red"}} key={i}>{errorMessage}</Text>) }
					
					
					<TouchableOpacity style={styles.button} onPress={this._onPressButton} >
					  <Text style={styles.buttonText} >Pagar</Text>
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