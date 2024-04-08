import axios from 'axios';

let data = {};
let previous = [];

function loadData(rest, appState, callback) {
	callback({ ...appState, loading: true });
	if (data.hasOwnProperty(rest.id)) {
		//console.log('called before');
		callback({ open: true, data: data[rest.id], rest: rest, loading: false, error: false });
	} else {
		const queries = {
			term: rest.name,
			latitude: rest.lat,
			longitude: rest.lng,
			sort_by: 'best_match',
			limit: 1,
		};
		//console.log(queries);
		const apiUrl = `${'https://tranquil-waters-09571.herokuapp.com/'}https://api.yelp.com/v3/businesses/search`;
		axios.get(apiUrl, {
			headers: {
				Authorization: `Bearer ${process.env.REACT_APP_YELP_API_KEY}`
			},
			params: queries
		})
			.then((res) => {
				//console.log(res.data.businesses[0]);
				let response = res.data.businesses[0];
				data[rest.id] = {
					is_closed: response.is_closed,
					name: response.name,
					price: response.price,
					rating: response.rating,
					categories: response.categories,
					location: {
						display_address: response.location.display_address
					},
					display_phone: response.display_phone,
					url: response.url
				};
				previous.push(rest.id);
				if (previous.length > 50) {
					delete data[previous[0]];
					previous.shift();
				}
				callback({ open: true, data: res.data.businesses[0], rest: rest, loading: false, error: false });
			})
			.catch((err) => {
				callback({ ...appState, error: true, loading: false, open: true });
			});
	}
}

export {loadData};