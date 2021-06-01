import React, { useEffect, useState } from 'react';
import axios from 'axios';

function loadData(rest, appState, callback) {
			callback({...appState, loading: true});
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
				let obj = res.data.businesses || res.data;
				callback({open: true, data: res.data.businesses[0], rest: rest, loading: false, error: false});
			})
			.catch((err) => {
				callback({...appState, error: true, loading: false, open: true});
			});
}

export default loadData;