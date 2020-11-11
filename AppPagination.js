import React, { Component } from 'react';
import { SafeAreaView, Alert, StyleSheet, ScrollView, View, Text, StatusBar, FlatList, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { List, ListItem, Left, Body, Right, Thumbnail } from "native-base";
import { format } from "date-fns";

import ApiTransaction from "./ApiTransaction";

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			data: [],
			page:1
		}
	}
	
	async componentDidMount() {
		let userToken = await AsyncStorage.getItem('userToken');
		/*let response = await ApiTransaction.getUpholdDetails(userToken);
			
			if (response.status==404) {
				console.log("User no conectado a Uphold");
				this.setState({ connected: false, verified: false, isLoadingConection: false });
			} else {
				result = await response.json();
				if (result.connected!=null && result.status_code==null && result.detail==null) {
					console.log("getUpholdDetails: "+result.last_updated+" "+result.connected+" "+result.verified);
					this.setState({ connected: result.connected, verified: result.verified, isLoadingConection: false });
				} else {
					Alert.alert(result.detail);
				}
			}*/
		this.LoadTransactionData(userToken);
	}
	
	LoadTransactionData = async (userToken) => {
		try {
			if(!userToken) userToken = await AsyncStorage.getItem('userToken');
			let result;
			
			result = await ApiTransaction.getUserTransactions(userToken, this.state.page, 10);
			
			if (result.status_code==null && result.detail==null) {
				//this.setState({ isLoadingTransactions: false, data: result, page: page, size: size });
				//this.setState({ isLoading: false, data: [] });
				this.setState({
					data: this.state.page === 1 ? result : [...this.state.data, ...result]
				})
			} else {
				Alert.alert(result.detail);
			}
		} catch (e) {
			Alert.alert("En estos momentos no podemos procesar su solicitud. Por favor intente más tarde");
			console.log(e);
		}
	}
	
	LoadMoreTransactionData = () =>{
		this.setState({
			page:this.state.page+1
		},()=>this.LoadTransactionData())
	}
	
	renderCustomItem = ({item, index }) => {
	  
	  let date = new Date(item.created_date);
	  let formattedDate = format(date, "dd/MM/yy");
	  let formattedTime = format(date, "HH:mm:ss");
	  
	  let { status } = item;
	  
	  if (status == "completed") { status = "completado"; }
	  else if (status == "failed") { status = "falló"; }
	  else if (status == "pending") { status = "pendiente"; }
	  
	  return (
		<ListItem avatar>
			<Body>
                <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#757575' }}>{item.company_name}</Text>
				<Text note>{formattedDate}</Text>
				<Text note>{formattedTime}</Text>
            </Body>
			<Right>
				<Text style={{ fontWeight: 'bold', fontSize: 17, color: '#757575' }}>Monto: ${Number(item.amount).toFixed(2)}</Text>
				<Text note>{status}</Text>
				<Text note>id Transacción: {item.id}</Text>
            </Right>
        </ListItem>
	  );
	}
	
	renderHeader = () => {
		return (<View style={{ justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: 'bold', fontSize: 25, color: '#67A254', paddingTop: 30, paddingBottom: 10 }}>Historial de transacciones</Text></View>);
	};
	
	keyExtractor = (item,index) => item.id.toString();
	
	render() {
		return (
			<View style={{ margin: 10, padding: 10 }}>
				<FlatList
					data={this.state.data}
					ListHeaderComponent={this.renderHeader}
					renderItem={this.renderCustomItem}
					keyExtractor={this.keyExtractor}
					onEndReachedThreshold={0.8}
					onEndReached={this.LoadMoreTransactionData}
				/>
			</View>
		)
	}
}