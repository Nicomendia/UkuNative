//Example to Refresh Previous Screen When Going Back in React Navigation//
import React, { Component } from 'react';
//import react in our code.
import { StyleSheet, View, Text, Button } from 'react-native';
//import all the components we are going to use.

export default class SecondPage extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0};
    //Settin up an interval for the counter
    this.t = setInterval(() => {
      this.setState({ count: this.state.count + 1 });
    }, 1000);
  }
  static navigationOptions = {
    title: 'Second Page',
    //Sets Header text of Status Bar
  };

  componentWillUnmount() {
    // Remove the event listener before removing the screen
    clearTimeout(this.t);
	console.log("unmount second");
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', fontSize: 18, margin: 16 }}>
          {'Hello I am counter ' + this.state.count}
        </Text>
        <Text style={{ textAlign: 'center', fontSize: 18, margin: 16 }}>
          You are on SecondPage
        </Text>
		<View>
			<Button title="Go Back" onPress={() => this.props.navigation.navigate('FirstPage')} />
		</View>
		<View>
			<Button title="Out" onPress={() => this.props.navigation.reset({ index: 0, routes: [{ name: 'Out' }] }) } />
		</View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});