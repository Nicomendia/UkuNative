import React, {Component}  from 'react';
import {View, Text, TextInput, TouchableHighlight} from 'react-native';
import ValidationComponent from 'react-native-form-validator';

export default class FormTest extends ValidationComponent {

  constructor(props) {
    super(props);
    this.state = {name : "My name", email: "tibtib@gmail.com", number:"56", date: "2017-03-01", newPassword : "", confirmPassword : ""};
	this._onPressButton = this._onPressButton.bind(this);
  }

  _onPressButton() {
	// Call ValidationComponent validate method
    let valid = this.validate({
      name: {minlength:3, maxlength:7, required: true},
      email: {email: true},
      number: {numbers: true},
      date: {date: 'YYYY-MM-DD'},
      confirmPassword : {equalPassword : this.state.newPassword}
    });
	console.log(valid);
  }


  render() {
	  console.log("entre");
	  let { name, email, number, date, newPassword, confirmPassword } = this.state;
	  
      return (
        <View>
          <TextInput ref="name" onChangeText={(name) => this.setState({name})} value={name} />
          <TextInput ref="email" onChangeText={(email) => this.setState({email})} value={email} />
          <TextInput ref="number" onChangeText={(number) => this.setState({number})} value={number} />
          <TextInput ref="date" onChangeText={(date) => this.setState({date})} value={date} />
		  {this.isFieldInError('date') && this.getErrorsInField('date').map((errorMessage, i) => <Text style={{color: "red"}} key={i}>{errorMessage}</Text>) }

          <TextInput ref="newPassword" onChangeText={(newPassword) => this.setState({newPassword})} value={newPassword}  secureTextEntry={true}/>
          <TextInput ref="confirmPassword" onChangeText={(confirmPassword) => this.setState({confirmPassword})} value={confirmPassword} secureTextEntry={true} />
		  {this.isFieldInError('confirmPassword') && this.getErrorsInField('confirmPassword').map((errorMessage, i) => <Text style={{color: "red"}} key={i}>{errorMessage}</Text>) }

          <TouchableHighlight onPress={this._onPressButton}>
            <Text>Submit</Text>
          </TouchableHighlight>

          <Text>
            {this.getErrorMessages()}
          </Text>
        </View>
      );
  }

}