import React, { Component } from 'react';
import { StyleSheet, Alert, View, Text, TouchableOpacity, Button, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { List, ListItem, Left, Body, Right, Thumbnail, Card } from "native-base";
import AsyncStorage from '@react-native-community/async-storage';
import { format } from "date-fns";

import ApiTransaction from "../../../ApiTransaction";
import Loader from '../../../loader';
import SimpleNotify from '../../../simpleNotify';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.deviceLocale = 'es';
		
		this.state = {
		  connected: false,
		  verified: false,
		  data: [],
		  page: 1,
		  isLoadingConection: true,
		  isLoadingTransactions: true,
		  loading: false,
		  visible: false,
		  message: ""
		};
	}
	
	handleNotify = (visible, message) => {
		this.setState({visible: visible, message: message});
	}
	
	async componentDidMount() {
		this.focusListener = this.props.navigation.addListener("focus", () => {
		  // The screen is focused
		  console.log("llegue a home otra vez");
		  this.setState({ 
			connected: false,
			verified: false,
			data: [],
			page: 1,
			isLoadingConection: true,
			isLoadingTransactions: true
		  });
		  this.refresh();
		});
	}
	
	componentWillUnmount() {
		// Remove the event listener
		//this.focusListener.remove();
		/*this.subs.forEach((sub) => {
		  sub.remove();
		});*/
		
		console.log("removing home");
	}
	
	async refresh() {
		try {
			let userToken = await AsyncStorage.getItem('userToken');
			let response = await ApiTransaction.getUpholdDetails(userToken);
			let result;
			
			if (response.status==404) {
				console.log("User no conectado a Uphold");
				this.setState({ connected: false, verified: false, isLoadingConection: false });
			} else {
				result = await response.json();
				if (result.connected!=null && result.status_code==null && result.detail==null) {
					console.log("getUpholdDetails refresh: "+result.last_updated+" "+result.connected+" "+result.verified);
					this.setState({ connected: result.connected, verified: result.verified, isLoadingConection: false });
				} else {
					//Alert.alert(result.detail);
					this.setState({ visible: true, message: result.detail });
				}
			}
			
			this.LoadTransactionData(userToken);	
		} catch (e) {
			//Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.");
			this.setState({ visible: true, message: "En estos momentos no podemos procesar su solicitud. Por favor intente más tarde" });
			console.log(e);
		}
	}
	
	LoadTransactionData = async (userToken) => {
		try {
			if(!userToken) userToken = await AsyncStorage.getItem('userToken');
			let result;
			
			result = await ApiTransaction.getUserTransactions(userToken, this.state.page, 10);
			
			console.log("state: "+this.state.page+" "+this.state.isLoadingConection+" "+this.state.isLoadingTransactions)
			
			//if(!this.state.isLoadingTransactions && !) {
				if (result.status_code==null && result.detail==null) {
					this.setState({
						isLoadingTransactions: false, loading: false,
						data: this.state.page === 1 ? result : [...this.state.data, ...result]
					})
				} else {
					//Alert.alert(result.detail);
					this.setState({
						loading: false, visible: true, message: result.detail
					});
				}
			//}
			
		} catch (e) {
			//Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.");
			this.setState({ visible: true, message: "En estos momentos no podemos procesar su solicitud. Por favor intente más tarde" });
			console.log(e);
		}
	}

	LoadMoreTransactionData = () =>{
		this.setState({
			page:this.state.page+1,
			loading: true
		},()=>this.LoadTransactionData())
	}
	
	renderCustomItem = ({item, index }) => {
	  
	  //let { item } = transaction;
	  let date = new Date(item.created_date);
	  let formattedDate = format(date, "dd/MM/yy");
	  let formattedTime = format(date, "HH:mm:ss");
	  
	  let { status } = item;
	  
	  if (status == "completed") { status = <Text style={{ fontWeight: 'bold', color: '#67A254' }} note>Completado</Text>; }
	  else if (status == "failed") { status = <Text style={{ fontWeight: 'bold', color: 'red' }} note>Falló</Text>; }
	  else if (status == "pending") { status = <Text style={{ fontWeight: 'bold', color: 'orange' }} note>Pendiente</Text>; }
	  
	  return (
		<Card style={{ backgroundColor: "#F5FFF5", margin: 3, borderRadius: 20 }}>
		<ListItem avatar>
			<Body>
                <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#555555' }}>{item.company_name}</Text>
				<Text note>{formattedDate}, {formattedTime}</Text>
            </Body>
			<Right>
				<Text style={{ fontWeight: 'bold', fontSize: 17, color: '#555555' }}>Monto: ${Number(item.amount).toFixed(2)}</Text>
					{status}
				<Text note>ID: {item.id}</Text>
            </Right>
        </ListItem>
		</Card>
	  );
	}
	
	keyExtractor = (item,index) => item.id.toString();

	render() {
		let { connected, verified, isLoadingConection, isLoadingTransactions, visible, message } = this.state;
		let link, transactions;
	  
		if (!isLoadingConection && !isLoadingTransactions) {
			if (!connected || !verified) {
				link =
					<Card style={{ flex: 1, alignItems: 'center', backgroundColor: "orange", paddingLeft: 10, paddingTop: 5, paddingBottom: 10, height: 80, borderRadius: 20 }}>
						<Text style={{ fontWeight: 'bold', fontSize: 16 }}>Su cuenta necesita estar asociada a una cuenta de Uphold verificada.</Text>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { screen: 'Uphold' }) } >
							<Text style={styles.underLineText}>Revisar</Text>
						</TouchableOpacity>
					</Card>;
			}
			
			if (this.state.data.length>0) {
				transactions = 
				<View style={{ flex: 5 }}>
					<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}><Text style={{ fontWeight: 'bold', fontSize: 25, color: '#67A254', paddingTop: 20, paddingBottom: 20 }}>Historial de transacciones</Text></View>
					<List style={{ flex: 6 }}>
					  <FlatList
						data={this.state.data}
						renderItem={this.renderCustomItem}
						keyExtractor={this.keyExtractor}
						onEndReachedThreshold={0.5}
						onEndReached={this.LoadMoreTransactionData}
					  />
					</List>
				</View>;
			} else {
				transactions = 
				<View style={{ flex: 5, justifyContent: 'center', alignItems: 'center' }}>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: 'bold', fontSize: 20, color: '#757575', alignSelf: "center", alignItems: 'center', justifyContent: 'center' }}>Esta cuenta no posee historial{"\n"}de transacciones.</Text></View>
				</View>;
			}

		  return (
			<View style={{ flex: 1, backgroundColor: "white", justifyContent: 'center' }}>
				<SimpleNotify visible={visible} message={message} handleNotify={this.handleNotify} />
				<Loader loading={this.state.loading}/>
				<View style={{ backgroundColor: "#AFC037", height: 100, justifyContent: "space-around", alignItems: "center"}} >
					<Text style={{ color: '#fff', fontSize: 35, fontWeight: "bold" }}>Bienvenido a UKU</Text>
					<Text style={{ color: '#fff', fontSize: 20, fontWeight: "bold", paddingBottom: 10 }}>La nueva forma de pagar</Text>
				</View>
				{link}
				{transactions}
			</View>
		  );
		} else {
			return (<View style={{ flex: 1, alignItems: 'center', backgroundColor: "white", justifyContent: 'center' }}><ActivityIndicator size="large" color='#AFC037' /></View>);
		}
		  
	}
}

const styles = StyleSheet.create({
	underLineText: {
		textDecorationLine: 'underline',
		color: 'blue',
		fontSize: 18,
		padding: 10,
		margin: 10,
		fontWeight: 'bold',
		textAlign: 'center',
	}
});