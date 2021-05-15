import React, { useEffect, useState } from 'react';
import {GoogleMap, useLoadScript, Marker, InfoWindow} from "@react-google-maps/api";
import axios from 'axios';

function loadData(Component, queries, fullscreen, id) {
  return function WihLoadingComponent({ isLoading, ...props }) {

  	const {isLoaded, loadError} = useLoadScript({
  		googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  		libraries: ["places"]
  	});

  	if (loadError) return "Error loading maps";

	const [appState, setAppState] = useState({
		loading: true,
		data: null,
	});

	useEffect(() => {
		setAppState({ loading: true });
		queries.limit = 18;
		console.log(queries);
		const apiUrl = id ? `${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/${id}` : `${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search`;
		axios.get(apiUrl, {
			headers: {
				Authorization: `Bearer ${process.env.REACT_APP_GOOGLE_API_KEY}`
			},
			params: queries
		})
		.then((res) => {
			let obj = res.data.businesses || res.data;
			setAppState({ loading: false, data: obj});
		});
	}, [setAppState]);

    if (isLoaded) return <Component {...props} data={appState.data} />;
    return (
      <h1>Loading...<h1/>
    );
  };
}

export default loadData;