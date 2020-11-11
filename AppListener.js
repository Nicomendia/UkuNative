//Example to Refresh Previous Screen When Going Back in React Navigation//
import React, { Component } from 'react';
//import react in our code. 
import { StyleSheet, View, Text, Button } from 'react-native';

//Import react-navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';

import FirstPage from './pages/FirstPage';
import SecondPage from './pages/SecondPage';
//import all the screens we are going to switch 

function Out({navigation}) {
  return (
	<View>
		<Text style={{ textAlign: 'center', fontSize: 18, margin: 16 }}>
		  {'Salimos'}
		</Text>
		<View>
			<Button title="Go First" onPress={() => navigation.navigate('FirstPage')} />
		</View>
	</View>
  );
}
 
const Stack = createStackNavigator();

export default function App (){
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="FirstPage">
				<Stack.Screen name="FirstPage" component={FirstPage} />
				<Stack.Screen name="SecondPage" component={SecondPage} />
				<Stack.Screen name="Out" component={Out} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}