import END_POINT from './config';

class Api {
	async login(email_or_username, password) {
		const response = await fetch(END_POINT+'users/login/', {
		  method: 'POST',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
			"email_or_username": email_or_username,
			"password": password
		  })
		});
		
		const json = await response.json();
		return json;
	}
	
	async signup(email, full_name, phone, password) {
		const response = await fetch(END_POINT+'users/', {
		  method: 'POST',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
			"email": email,
			"profile": {
				"full_name": full_name,
				"phone": phone
			},
			"password": password
		  })
		});	
		const json = await response.json();
		console.log(json);
		return json;
	}
	
	async signout(userToken) {
		const response = await fetch(END_POINT+'users/logout/', {
		  method: 'POST',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			"Authorization": "Token "+userToken
		  }
		});	
		return;
	}
	
	async forgotPassword(email) {
		const response = await fetch(END_POINT+'users/forgot-password/', {
		  method: 'POST',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
			"email": email
		  })
		});
		//console.log(JSON.stringify(response, null, 4));
		return response;
	}
	
	async resetPassword(key, password1, password2) {
		const response = await fetch(END_POINT+'users/reset-password/', {
		  method: 'POST',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
			"key": key,
			"password1": password1,
			"password2": password2
		  })
		});
		//console.log(JSON.stringify(response, null, 4));
		return response;
	}
	
	async activateAccount(code) {
		const response = await fetch(END_POINT+'users/activate-account/'+code, {
		  method: 'POST',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		  }
		});
		//console.log(JSON.stringify(response, null, 4));
		return response;
	}
	
	async getProfile(userToken) {
		const response = await fetch(END_POINT+'users/profiles/', {
		  method: 'GET',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			"Authorization": "Token "+userToken
		  }
		});
		
		const json = await response.json();
		return json;
	}
	
	async updateProfile(userToken, full_name, phone) {
		const response = await fetch(END_POINT+'users/profiles/', {
		  method: 'PUT',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			"Authorization": "Token "+userToken
		  },
		  body: JSON.stringify({
			"full_name": full_name,
			"phone": phone
		  })
		});
		
		const json = await response.json();
		return json;
	}
}

export default new Api();