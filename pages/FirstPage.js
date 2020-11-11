//Example to Refresh Previous Screen When Going Back in React Navigation//
import React, { Component } from 'react';
//import react in our code.
import { StyleSheet, View, Button, Text } from 'react-native';
//import all the components we are going to use.

export default class FirstPage extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    //Settin up an interval for the counter
    this.t = setInterval(() => {
      this.setState({ count: this.state.count + 1 });
    }, 1000);
  }
  static navigationOptions = {
    title: 'First Page',
    //Sets Header text of Status Bar
    headerStyle: {
      backgroundColor: '#f4511e',
      //Sets Header color
    },
    headerTintColor: '#fff',
    //Sets Header text color
    headerTitleStyle: {
      fontWeight: 'bold',
      //Sets Header text style
    },
  };
  componentDidMount() {
    //Here is the Trick
    const { navigation } = this.props;
    //Adding an event listner om focus
    //So whenever the screen will have focus it will set the state to zero
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({ count: 0 });
	  console.log("first");
    });
  }

  componentWillUnmount() {
    // Remove the event listener before removing the screen from the stack
    //this.focusListener.remove();
    clearTimeout(this.t);
	console.log("unmount first");
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', fontSize: 18, margin: 16 }}>
          {'Hello I am counter ' + this.state.count}
        </Text>
        <Button title="Go next" onPress={() => navigate('SecondPage')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});