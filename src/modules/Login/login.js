import React, { Component } from 'react';
import { Content, Form, Input, Item, Label } from 'native-base';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, Button, Platform, Linking } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import ValidationComponent from 'react-native-form-validator';

import AuthContext from '../../../AuthContext';
import SimpleNotify from '../../../simpleNotify';

export default class App extends ValidationComponent {
	
	constructor(props) {
		super(props);
		this.deviceLocale = 'es';

		this.state = {
		  secure: true,
		  icon: 'eye',
		  email: "",
		  password: "",
		  visible: false,
		  message: "",
		  redirect: false
		};
		
		this._onPressButton = this._onPressButton.bind(this);
	}
	
	handleNotify = (visible, message) => {
		this.setState({visible: visible, message: message});
	}
	
	componentDidUpdate(prevProps, prevState) {
	  if(prevState.visible && !this.state.visible && this.state.redirect){
		  console.log("redirigiendo");
		  this.props.navigation.navigate("SignIn");
	  }
	}
		
	async componentDidMount() {
		try {
			let userLogin = await AsyncStorage.getItem('userLogin');
			
			if (userLogin!=null) {
				this.setState({ email: userLogin });
			}
			
			Linking.getInitialURL().then(url => {
			  this.navigate(url);
			});
			Linking.addEventListener('url', this.handleOpenURL);			
		} catch (e) {
			console.log(e);
		}
	}
	
	componentWillUnmount() {
		Linking.removeEventListener('url', this.handleOpenURL);
		console.log("removing login");
	}
	
	handleOpenURL = (event) => {
		this.navigate(event.url);
	}
  
	navigate = async (url) => {
		if(url) {
			if(url.includes('https://uku-pay.com/')) {
				let key = url.split('/')[3];
				this.props.navigation.navigate("Reset", { key: key });
			} else if(url.includes('http://mobile.uku-pay.com/')) {
				let key = url.split('/')[3];

				try {	
					let response = await Api.activateAccount(key);
					
					if (response.status==200) {
						console.log("Cuenta activa!");
						//Alert.alert("Muy bien!","Su cuenta ha sido activada exitosamente.", this.props.navigation.navigate("SignIn"));
						this.setState({ visible: true, message: "Muy bien! su cuenta ha sido activada exitosamente.", redirect: true });
					} else {
						const json = await response.json();
						if(json.status_code!=null && json.detail!=null) {
							//Alert.alert(json.detail);
							this.setState({ visible: true, message: json.detail });
							console.log("Fallo de recuperacion password");
						}
					}
				} catch (error) {
					//Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.");
					this.setState({ visible: true, message: "En estos momentos no podemos procesar su solicitud. Por favor intente más tarde" });
					console.log(error);
					return false;
				}

			}
		}
		
		// https://uku-pay.com/5fa20dbb90a90f6e1f8d7b512364417e80824991 cambio de password
		// buscar el de activacion de cuenta al registrar.. de momento estoy asumiendo q sera tipo http://mobile.uku-pay.com/1a3s51d35a1sd351asd51
		// https://uku-pay.com/bc2dce3e739d953f46c19b060e28b290b74e087d activacion de cuenta
		
	}
	
	async _onPressButton() {
		let isValid = this.isValid();
		
		if (isValid) {
			const AuthContext = this.context;
			const signIn  = AuthContext.signIn;
			signIn( this.state );
		}
	}
	
	isValid () {
		return this.validate({
		  email: {email: true, required: true},
		  password: {required: true}
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
	let { password, email, visible, message } = this.state;
	  
    return (
      <View style={styles.container}>
        <SimpleNotify visible={visible} message={message} handleNotify={this.handleNotify} />
		<Content>
		  <Image source={require('../../../assets/logo-UKU-green.png')} style={styles.image}></Image>
		  <Text style={{ fontSize: 16, color: "darkgrey", fontWeight: "bold", alignSelf: "center"}}>La nueva forma de pagar</Text>
          <Form>
            <Item floatingLabel >
              <Label>Email</Label>
              <Input value={email} onChangeText={ (email) => this.setState({ email }) } />
            </Item>
			{this.isFieldInError('email') && this.getErrorsInField('email').map((errorMessage, i) => <Text style={{color: "red"}} key={i}>{errorMessage}</Text>) }
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input value={password} onChangeText={ (password) => this.setState({ password }) } secureTextEntry={this.state.secure} />
            </Item>
			{this.isFieldInError('password') && this.getErrorsInField('password').map((errorMessage, i) => <Text style={{color: "red"}} key={i}>{errorMessage}</Text>) }
			<Icon name={this.state.icon} color={'black'} onPress={this.changeIcon.bind(this)} size={22} style={styles.icons}/>			
			<TouchableOpacity style={styles.button} onPress={this._onPressButton} >
			  <Text style={styles.buttonText} >Ingresar</Text>
			</TouchableOpacity>
			
			<TouchableOpacity onPress={() => this.props.navigation.navigate('Forgot')} >
				<Text style={styles.underLineText}>Olvidó su contraseña?</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => this.props.navigation.navigate('Register')} >
				<Text style={styles.underLineText}>Regístrate</Text>
			</TouchableOpacity>
          </Form>
        </Content>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  underLineText: {
    textDecorationLine: 'underline',
    color: 'blue',
	fontSize: 15,
	padding: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: "center",
	backgroundColor: "white"
  },
  button: {
    alignItems: "center",
	alignSelf: "center",
    backgroundColor: "#AFC037",
	margin: 8,
	borderRadius: 50,
    padding: 8
  },
  buttonText: {
    fontWeight: "bold",
	color: "white",
	padding: 8,
	fontSize: 18
  },
  icons: {
    textAlign: 'center',
    textAlignVertical: 'center',
	marginTop: 10,
	marginLeft: 15,
	width: 30,
	height: 30
  },
  image: {
	width: 160,
	height: 80,
	resizeMode: "contain",
	alignSelf: "center"
  }
});