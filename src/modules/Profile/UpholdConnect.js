import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image, Button, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import END_POINT from '../../../config';
import ApiTransaction from "../../../ApiTransaction";
import SimpleNotify from '../../../simpleNotify';

export default class MyWeb extends Component {
  state = {
    url: END_POINT+'uphold/connect/',
	userToken: "",
	visible: false,
	message: "",
	redirect: false
  };
  
  webview = null;
  
	handleNotify = (visible, message) => {
		console.log("handleNotify visible: "+visible);
		this.setState({visible: visible, message: message});
	}
	
	componentDidUpdate(prevProps, prevState) {
		console.log("visible pre: "+prevState.visible+", visible pos: "+this.state.visible);
	  if(prevState.visible && !this.state.visible && this.state.redirect){
		  console.log("redirigiendo");
		  this.props.navigation.navigate("Uphold");
	  }
	}
  
  async componentDidMount() {
	  try {
			let userToken = await AsyncStorage.getItem('userToken');
			this.setState({ userToken });
	  } catch (error) {
			console.log(error);
			//Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.", this.props.navigation.navigate("Uphold"));
			this.setState({ visible: true, message: "En estos momentos no podemos procesar su solicitud. Por favor intente más tarde.", redirect: true });
	  }
  }
  
  navigate = async (url, message) => {
		try {
			console.log("redirigiendo a upholdScreen por url: "+url);
			let response = await ApiTransaction.putUpholdDetails(this.state.userToken);
			//console.log(response);
			//Alert.alert(message);
			this.setState({ visible: true, message: message, redirect: true });
			//this.props.navigation.navigate('Uphold');
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
		let { visible, redirect } = this.state;
		
		if (!url) return;
		
		if(!visible && !redirect){
			
			if (url.includes('https://uku-pay.com/uphold/success')) {
			  this.webview.stopLoading();
			  //Alert.alert("Se ha conectado exitosamente.");
			  await this.navigate(url, "Se ha conectado exitosamente.");
			}
			
			if (url.includes('https://uku-pay.com/uphold/error')) {
			  this.webview.stopLoading();
			  //Alert.alert("Error al tratar de conectar.");
			  await this.navigate(url, "Error al tratar de conectar.");
			}
		}
		
	};
  
  render() {
	let { userToken, url, visible, message } = this.state;
	
	console.log("Token en Web View: "+userToken+", url: "+url);
	  
	if (userToken != "") {
		if (visible) {
			return (<View style={{ flex: 1, alignItems: 'center', backgroundColor: "white", justifyContent: 'center' }}><SimpleNotify visible={visible} message={message} handleNotify={this.handleNotify} /></View>);
		} else {
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
							console.log("onShouldStartLoadWithRequest");
							this.setState({url: navigator.url});
							return false;
						}}
						onNavigationStateChange={this.handleNavigation}
						style={{ marginTop: 20 }}
					  >
					  </WebView>
				);
		}
	} else {
		return (<View style={{ flex: 1, alignItems: 'center', backgroundColor: "white", justifyContent: 'center' }}><ActivityIndicator size="large" color='#AFC037' /></View>);
	}
  }
}
