import React, { Component } from "react";
import { View, Text, Alert, FlatList } from "react-native";
import { List, ListItem, Left, Body, Right, Thumbnail } from "native-base";
import AsyncStorage from '@react-native-community/async-storage';
import { format } from "date-fns";

import ApiTransaction from "./ApiTransaction";

class FlatListDemo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      data: []
    };
  }

  async componentDidMount() {
	try {
		let userToken = await AsyncStorage.getItem('userToken');
		let result = await ApiTransaction.getUserTransactions(userToken);
		
		if (result.status_code==null && result.detail==null) {
			this.setState({ isLoading: false, data: result });
		} else {
			Alert.alert(result.detail);
		}
	} catch (e) {
		Alert.alert("Alerta", "En estos momentos no podemos procesar su solicitud.\nPor favor intente más tarde.");
		console.log(e);
	}
  };
  
  renderItem(transaction, index) {
	  
	  let item = transaction.item;
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

  render() {
	  let { isLoading } = this.state;
	  
	  if(!isLoading) {  
		  return (
			<List>
			  <FlatList
				data={this.state.data}
				keyExtractor={item => item.id.toString()}
				renderItem={(item, index) => this.renderItem(item, index)}
			  />
			</List>
		  );
	  }
	  else {
		  return (<List/>);
	  }
  }
}

export default FlatListDemo;


/*

import React, { Component } from "react";
import { View, Text, FlatList } from "react-native";
import { List, ListItem, Left, Body, Right, Thumbnail } from "native-base";

class FlatListDemo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    this.setState({ loading: true });
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  render() {
  return (
    <List>
      <FlatList
        data={this.state.data}
		keyExtractor={item => item.email}
        renderItem={({ item }) => (
          <ListItem avatar>
			<Left>
				<Thumbnail source={{ uri: item.picture.thumbnail }} />
            </Left>
			<Body>
                <Text>{`${item.name.first} ${item.name.last}`}</Text>
                <Text note>{item.email}</Text>
            </Body>
			<Right>
                <Text note>3:43 pm</Text>
            </Right>
          </ListItem>
        )}
      />
    </List>
  );
}
}

export default FlatListDemo;

*/