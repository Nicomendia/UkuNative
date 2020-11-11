import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, Button } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import END_POINT from '../../../config';
import ApiTransaction from "../../../ApiTransaction";

export default class MyWeb extends Component {
  state = {
    url: END_POINT+'uphold/connect/',
	userToken: ""
  };
  
  webview = null;
  
  async componentDidMount() {
	  try {
			let userToken = await AsyncStorage.getItem('userToken');
			this.setState({ userToken });
	  } catch (error) {
			Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.", this.props.navigation.navigate("Uphold"));
			console.log(error);
	  }
  }
  
  navigate = async (url) => {
		try {
			console.log("redirigiendo a upholdScreen por url: "+url);
			let response = await ApiTransaction.putUpholdDetails(this.state.userToken);
			console.log(response);
			this.props.navigation.navigate('Uphold');
		} catch (e) {
        console.log(e);
      }
  }
  
  handleNavigation = async (newNavState) => {
		// newNavState looks something like this:
		// {
		//   url?: string;
		//   title?: string;
		//   loading?: boolean;
		//   canGoBack?: boolean;
		//   canGoForward?: boolean;
		// }
		const { url } = newNavState;
		if (!url) return;

		if (url.includes('https://uku-pay.com/uphold/success')) {
		  this.webview.stopLoading();
		  Alert.alert("Se ha conectado exitosamente.");
		  await this.navigate(url);
		}
		
		if (url.includes('https://uku-pay.com/uphold/error')) {
		  this.webview.stopLoading();
		  Alert.alert("Error al tratar de conectar.");
		  await this.navigate(url);
		}
		
	};
  
  render() {
	let { userToken, url } = this.state;
	
	console.log("Token en Web View: "+userToken+", url: "+url);
	  
	if (userToken != "") {
		return (
			  <WebView
				ref={ref => (this.webview = ref)}
				source={{
					uri: url,
					headers: {	
					  "Authorization": "Token "+userToken
					}
				}}
				onShouldStartLoadWithRequest={(navigator) => {
					this.setState({url: navigator.url});
					return false;
				}}
				onNavigationStateChange={this.handleNavigation}
				style={{ marginTop: 20 }}
			  />
		);
	} else {
		return (<View><Text>Conectando con Uphold, favor espere...</Text></View>);
	}
  }
}
