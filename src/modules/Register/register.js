import React, { Component } from 'react';
import { Content, Form, Input, Item, Label } from 'native-base';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, Button } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import ValidationComponent from 'react-native-form-validator';

import AuthContext from '../../../AuthContext';

export default class App extends ValidationComponent {
	
	constructor(props) {
		super(props);
		this.deviceLocale = 'es';

		this.state = {
		  secure: true,
		  icon: 'eye',
		  password: "",
		  email: "",
		  full_name: "",
		  phone: ""
		};
		
		this._onPressButton = this._onPressButton.bind(this);
	}
	
	async _onPressButton() {
		let isValid = this.isValid();
		
		if (isValid) {
			const AuthContext = this.context;
			const signUp  = AuthContext.signUp;
			let isSignedUp = await signUp( this.state );
			
			if (isSignedUp) {
				console.log("SignUp retorno true");
				this.props.navigation.navigate('Activate');
			}
		}
	}
	
	isValid () {
		return this.validate({
		  email: {email: true, required: true},
		  password: {minlength:8, required: true},
		  full_name: {required: true},
		  phone: {required: true},
		});
	}
	
	changeIcon() {
		this.setState(prevState => ({
            icon: prevState.icon === 'eye' ? 'eye-slash' : 'eye',
            secure: !prevState.secure
        }));
    }
	
	static contextType = AuthContext;
	
  render() {
	let { password, email, full_name, phone } = this.state;
		
	const AuthContext = this.context;
	const signUp  = AuthContext.signUp;
	  
	  
    return (
      <View style={styles.container}>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Nombre Completo</Label>
              <Input value={full_name} onChangeText={ (full_name) => this.setState({ full_name }) } />
            </Item>
			{this.isFieldInError('full_name') && this.getErrorsInField('full_name').map((errorMessage, i) => <Text style={{color: "red"}} key={i}>{errorMessage}</Text>) }
			<Item floatingLabel>
              <Label>Correo Electrónico</Label>
              <Input value={email} onChangeText={ (email) => this.setState({ email }) } />
            </Item>
			{this.isFieldInError('email') && this.getErrorsInField('email').map((errorMessage, i) => <Text style={{color: "red"}} key={i}>{errorMessage}</Text>) }
			<Item floatingLabel>
              <Label>Teléfono</Label>
              <Input value={phone} onChangeText={ (phone) => this.setState({ phone }) } />
            </Item>
			{this.isFieldInError('phone') && this.getErrorsInField('phone').map((errorMessage, i) => <Text style={{color: "red"}} key={i}>{errorMessage}</Text>) }
            <Item floatingLabel>
              <Label>Password</Label>
              <Input value={password} onChangeText={ (password) => this.setState({ password }) } secureTextEntry={this.state.secure} />
            </Item>
			{this.isFieldInError('password') && this.getErrorsInField('password').map((errorMessage, i) => <Text style={{color: "red"}} key={i}>{errorMessage}</Text>) }
			<Icon name={this.state.icon} color={'black'} onPress={this.changeIcon.bind(this)} size={22} style={styles.icons}/>			
			<TouchableOpacity style={styles.button} onPress={this._onPressButton} >
			  <Text style={styles.buttonText} >Registrar</Text>
			</TouchableOpacity>
          </Form>
        </Content>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
	backgroundColor: "white"
  },
  button: {
    alignItems: "center",
	alignSelf: "center",
    backgroundColor: "#AFC037",
	margin: 10,
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
	marginTop: 10,
	marginLeft: 15,
	width: 30,
	height: 30
  }
});