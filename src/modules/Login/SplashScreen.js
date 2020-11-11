import React, { Component } from 'react';
import { Content } from 'native-base';
import { StyleSheet, View, Text, Image } from 'react-native';

export default class App extends Component {
	render() {
	  return (
		<View style={styles.container}>
			<Content>
			  <Image source={require('../../../assets/logo-UKU-green.png')} style={styles.image}></Image>
			  <Text style={{ fontSize: 20, color: "darkgrey", fontWeight: "bold", alignSelf: "center"}}>La nueva forma de pagar</Text>
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
  image: {
	marginTop: 100,
	width: 300,
	height: 150,
	resizeMode: "contain",
	alignSelf: "center"
  }
});