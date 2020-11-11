import React, { Component } from 'react';
import { Container, Header, Content, Form, Item, Picker, Text, Icon, TextInput, Input, Label, Button } from 'native-base';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected2: undefined
    };
  }
  
  onValueChange2(value: string) {
    this.setState({
      selected2: value
    });
  }

  render() {

    return (
      <Container>
        <Header style={{ backgroundColor: "yellowgreen", height: "10%" }} />
        <Content>
          <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                style={{ width: undefined }}
                placeholder="Seleccione su tarjeta de Uphold"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selected2}
                onValueChange={this.onValueChange2.bind(this)}
              >
                <Picker.Item label="USD Card $40.00" value="key0" />
                <Picker.Item label="Mi tarjeta $100.00" value="key1" />
              </Picker>
            </Item>
			<Item floatingLabel>
              <Label>Monto</Label>
              <Input keyboardType={'numeric'} />
            </Item>
			<Text style={{ fontSize: 14, padding: 5, margin: 5 }}>Comision $2</Text>
			<Text style={{ fontSize: 20, fontWeight: "bold", padding: 10 }}>Total $35</Text>
			<Button rounded style={{ backgroundColor: "yellowgreen", alignSelf: "center", padding: 10, margin: 10 }}>
				<Text style={{ fontWeight: "bold", fontSize: 20}}>Pagar</Text>
			</Button>
          </Form>
        </Content>
      </Container>
    );
  }
}




/*

import React from 'react';
import { Item, Input, Icon, Label } from 'native-base';

class PasswordTextBox extends React.Component {
    state = {
        icon: "eye-off",
        password: true
    };

    _changeIcon() {
        this.setState(prevState => ({
            icon: prevState.icon === 'eye' ? 'eye-off' : 'eye',
            password: !prevState.password
        }));
    }

    render() {
        const { label, icon, onChange } = this.props;
        return (
            <Item floatingLabel>
                <Icon active name={icon} />
                <Label>{label}</Label>
                <Input secureTextEntry={this.state.password} onChangeText={(e) => onChange(e)} />
                <Icon name={this.state.icon} onPress={() => this._changeIcon()} />
            </Item>
        );
    }
}

export default PasswordTextBox;*/

/*import React, { Component } from 'react';
import { AppLoading } from 'expo';

import { Container, Header, Content, Form, Item, Picker, Text, Icon, TextInput, Input, Label, Button } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false, selected2: undefined,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }
  
  onValueChange2(value: string) {
    this.setState({
      selected2: value
    });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <Container>
        <Header style={{ backgroundColor: "yellowgreen", height: "10%" }} />
        <Content>
          <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                placeholder="Seleccione su tarjeta de Uphold"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selected2}
                onValueChange={this.onValueChange2.bind(this)}
              >
                <Picker.Item label="USD Card $40.00" value="key0" />
                <Picker.Item label="Mi tarjeta $100.00" value="key1" />
              </Picker>
            </Item>
			<Item floatingLabel>
              <Label>Monto</Label>
              <Input keyboardType={'numeric'} />
            </Item>
			<Text style={{ fontSize: 14, padding: 5, margin: 5 }}>Comision $2</Text>
			<Text style={{ fontSize: 20, fontWeight: "bold", padding: 10 }}>Total $35</Text>
			<Button rounded style={{ backgroundColor: "yellowgreen", alignSelf: "center", padding: 10, margin: 10 }}>
				<Text style={{ fontWeight: "bold", fontSize: 20}}>Pagar</Text>
			</Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

/*

import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  onPress = () => {
    this.setState({
      count: this.state.count + 1
    });
  };

  render() {
    const { count } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.countContainer}>
          <Text>Count: {count}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={this.onPress}
        >
          <Text>Press Here</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  countContainer: {
    alignItems: "center",
    padding: 10
  }
});

export default App;



import React, { Component } from 'react';
import { Item, Input, TextInput, Label, View } from 'native-base';

class App extends Component {
	
  render() {
    return (
        <View>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input />
            </Item>
        </View>
    );
  }
}

export default App;


/*
import React, { Component } from 'react';
import { Form, Item, Input, Label, View } from 'native-base';
class App extends Component {
  render() {
    return (
        <View>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input />
            </Item>
        </View>
    );
  }
}

export default App;

*/