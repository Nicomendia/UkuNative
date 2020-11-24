import 'intl';
import 'intl/locale-data/jsonp/en';

import React, { Component } from 'react';
import {SafeAreaView, StyleSheet, View, Text, TextInput} from 'react-native'


export default class App extends Component {
	
	constructor(props) {
		super(props);
		this.deviceLocale = 'es';
		
		this.state = {
		  amount: "0.00"
		};
		
		this._onEndEditing = this._onEndEditing.bind(this);
		this._onChangeText = this._onChangeText.bind(this);
	}
	
	_onEndEditing() {
		let amount = parseFloat(this.state.amount).toFixed(2) || "0.00";
		if (amount==="NaN") amount = "0.00";
		this.setState({ amount });
	}
	
	_onChangeText(amount) {
		this.setState({
			amount: amount.replace(/[^0-9\\.]/g, '')
		})
	}
	
	
	render(){
		let { amount } = this.state;
		console.log(parseFloat(this.state.amount).toFixed(2));
		
	  return (
			  <TextInput
				keyboardType={'numeric'} 
				onChangeText={(amount) => this._onChangeText(amount)}
				onEndEditing={this._onEndEditing}
				value={ this.state.amount }
			  />
	  );
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  nativeTextInput: {
    fontSize: 17,
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
  },
})