import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      full_name: "Cargando...",
      isLoading: true
    };
  }

  componentDidMount() {
    fetch('https://www.uku-pay.com/api/users/profiles/', {
		  method: 'GET',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			"Authorization": "Token efaa9966e517a585ba55ec773fb0d78b9a6f60f2"
		  }
		})
      .then((response) => response.json())
      .then((json) => {
        this.setState({ full_name: json.profile.full_name });
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const { full_name, isLoading } = this.state;

    return (
      <View style={{ flex: 1, padding: 24 }}>
        {isLoading ? <ActivityIndicator/> : (
            <Text>{full_name}</Text>
        )}
      </View>
    );
  }
};


/*
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true
    };
  }

  componentDidMount() {
    fetch('https://www.googleapis.com/books/v1/volumes?q=Harry&key=AIzaSyAyF4p3N8DVWKUmK7dII0-l2G3xWNlL63w')
      .then((response) => response.json())
      .then((json) => {
        this.setState({ data: json.items });
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    const { data, isLoading } = this.state;

    return (
      <View style={{ flex: 1, padding: 24 }}>
        {isLoading ? <ActivityIndicator/> : (
          <FlatList
            data={data}
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => (
              <Text>{item.volumeInfo.title}, {item.volumeInfo.publishedDate}</Text>
            )}
          />
        )}
      </View>
    );
  }
};
*/