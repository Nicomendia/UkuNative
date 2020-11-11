import END_POINT from './config';

class Api {	
	async getCompanyById(id, userToken) {
		console.log("Id comercio: "+id+", token: "+userToken);
		const response = await fetch(END_POINT+'companies/'+id+'/', {
		  method: 'GET',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			"Authorization": "Token "+userToken
		  }
		});
		const json = await response.json();
		console.log(json);
		return json;
	}
	
	async getUpholdDetails(userToken) {
		console.log("Token: "+userToken);
		const response = await fetch(END_POINT+'uphold/details/', {
		  method: 'GET',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			"Authorization": "Token "+userToken
		  }
		});
		//console.log(response);
		return response;
	}
	
	async putUpholdDetails(userToken) {
		console.log("Token: "+userToken);
		const response = await fetch(END_POINT+'uphold/details/', {
		  method: 'PUT',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			"Authorization": "Token "+userToken
		  }
		});
		console.log("putUpholdDetails");
		return response;
	}
	
	async disconnectUphold(userToken) {
		const response = await fetch(END_POINT+'uphold/disconnect/', {
		  method: 'DELETE',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			"Authorization": "Token "+userToken
		  }
		});
		return response;
	}
	
	async getUpholdCards(userToken) {
		const response = await fetch(END_POINT+'uphold/cards/', {
		  method: 'GET',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			"Authorization": "Token "+userToken
		  }
		});
		const json = await response.json();
		console.log(json);
		return json;
	}
	
	async createTransaction(userToken, description, amount, company_id, card_id) {
		const response = await fetch(END_POINT+'transactions/', {
		  method: 'POST',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			"Authorization": "Token "+userToken
		  },
		  body: JSON.stringify({
			"description": description,
			"amount": amount,
			"company_id": company_id,
			"description": description,
			"card_id": card_id
		  })
		});
		
		const json = await response.json();
		return json;
	}
	
	async getUserTransactions(userToken, page, size) {
		const response = await fetch(END_POINT+'transactions/?page='+page+"&size="+size, {
		  method: 'GET',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			"Authorization": "Token "+userToken
		  }
		});
		const json = response.json();
		return json;
	}
}

export default new Api();