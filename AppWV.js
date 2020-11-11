import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

const END_POINT = "https://uku-pay.com/api/";
const userToken= "efaa9966e517a585ba55ec773fb0d78b9a6f60f2";

export default class MyWeb extends Component {
  state = {
    url: END_POINT+'uphold/connect/',
  };
  
  render() {
    return (
      <WebView
        source={{
			uri: this.state.url,
			headers: {	
			  "Authorization": "Token "+userToken
			}
		}}
		onShouldStartLoadWithRequest={(navigator) => {
			this.setState({url: navigator.url});
			return false;
		  }}
		
        style={{ marginTop: 20 }}
      />
    );
  }
}




/*
import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

export default class testApp extends Component {
  state = {
    url: "http://10.0.2.2:3000",
  };

  render() {
    return (
	  <WebView
		  source={{ 
			uri: this.state.url,
			headers: {"custom-app-header": "react-native-ios-app"}
		  }}
		  onShouldStartLoadWithRequest={(navigator) => {
			this.setState({url: navigator.url});
			return false;
		  }}
		/>
    );
  }
}


	/*<WebView
        onLoadStart={(navState) => this.setState({url: navState.nativeEvent.url})}
        source={
          {
            uri: this.state.url,
            headers: {"custom-app-header": "react-native-ios-app"}
          }
        }
      />


/*import React from 'react';
import { WebView  } from 'react-native-webview';

export default class App extends React.Component {
  render() {
    return (
      <WebView
      source={{uri: 'https://github.com/facebook/react-native'}} 
    />
    );
  }
}*/