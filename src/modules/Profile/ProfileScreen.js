import React, { Component } from 'react';
import { Container, Header, Content, Form, Input, Item, Label } from 'native-base';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, Button } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Icon from 'react-native-vector-icons/FontAwesome';

import ValidationComponent from 'react-native-form-validator';

import Api from "../../../Api";

export default class App extends ValidationComponent {
	constructor(props) {
		super(props);
		this.deviceLocale = 'es';
		
		this.state = {
		  email: "Cargando...",
		  full_name: "Cargando...",
		  phone: "Cargando...",
		  isLoading: true
		};
		
		this._onPressButton = this._onPressButton.bind(this);
	}
	
	async componentDidMount() {
		try {
			let userToken = await AsyncStorage.getItem('userToken');
			let result = await Api.getProfile(userToken);
			if (result.profile.full_name!=null && result.status_code==null && result.detail==null) {
				console.log("profile display: "+result.email+" "+result.profile.full_name+" "+result.profile.phone);
				this.setState({ email: result.email, full_name: result.profile.full_name, phone: result.profile.phone, isLoading: false });
			} else {
				Alert.alert(result.detail);
			}
		} catch (e) {
			Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.");
			console.log(e);
		}
	}
	
	async _onPressButton() {
		let isValid = this.isValid();
		
		if (isValid) {	
			try {
				let userToken = await AsyncStorage.getItem('userToken');
				let response = await Api.updateProfile(userToken, this.state.full_name, this.state.phone);
				
				if (response.id!=null && response.status_code==null && response.detail==null) {
					console.log("updateProfile: "+response);
					Alert.alert("Cambios guardados con exito!");
				} else {
					Alert.alert(response.detail);
				}
			} catch (error) {
				Alert.alert("En estos momentos no podemos procesar su solicitud. Por favor intente más tarde");
				console.log(error);
				return false;
			}
		}
	}
	
	isValid () {
		return this.validate({
		  full_name: {required: true},
		  phone: {required: true}
		});
	}
	
  render() {
	let { email, full_name, phone, isLoading } = this.state;
	  
    return (
		<Container>
			<Header style={{ backgroundColor: "#AFC037", height: 70, justifyContent: "space-around", alignItems: "center", paddingBottom: 10}} >
				<Text style={{ color: '#fff', fontSize: 25, fontWeight: "bold" }}>Editar Perfil</Text>
				<MaterialCommunityIcons name="menu" color={'#fff'} size={45} onPress={() => this.props.navigation.toggleDrawer()} />
			</Header>
				<Content>
				  <Form>
					<Item floatingLabel>
					  <Label>Nombre Completo</Label>
					  <Input value={full_name} onChangeText={ (full_name) => this.setState({ full_name }) } />
					</Item>
					{this.isFieldInError('full_name') && this.getErrorsInField('full_name').map((errorMessage, i) => <Text style={{color: "red"}} key={i}>{errorMessage}</Text>) }
					<Item floatingLabel>
					  <Label>Teléfono</Label>
					  <Input value={phone} onChangeText={ (phone) => this.setState({ phone }) } />
					</Item>
					{this.isFieldInError('phone') && this.getErrorsInField('phone').map((errorMessage, i) => <Text style={{color: "red"}} key={i}>{errorMessage}</Text>) }


					<Label style={{marginTop: 15, marginLeft: 15, color: "grey"}}>Correo Electrónico</Label>
					<View style={styles.emailSection}>
						<Text style={styles.text}>{email}</Text>
						<Icon style={styles.checkIcon} name="check" size={20} color="#67A254"/>
					</View>
					
					
					<TouchableOpacity style={styles.button} onPress={this._onPressButton} >
					  <Text style={styles.buttonText} >Guardar</Text>
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
  emailSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
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
    backgroundColor: 'lightgrey',
    color: '#424242',
	marginLeft: 15,
  },
});


/*
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      full_name: "Cargando...",
      isLoading: true
    };
  }

  componentDidMount() {
    fetch('https://www.uku-pay.com/api/users/profiles/', {
		  method: 'GET',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			"Authorization": "Token efaa9966e517a585ba55ec773fb0d78b9a6f60f2"
		  }
		})
      .then((response) => response.json())
      .then((json) => {
        this.setState({ full_name: json.profile.full_name });
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const { full_name, isLoading } = this.state;

    return (
      <View style={{ flex: 1, padding: 24 }}>
        {isLoading ? <ActivityIndicator/> : (
            <Text>{full_name}</Text>
        )}
      </View>
    );
  }
};

*/