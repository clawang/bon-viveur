/*global google*/
import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import {Eatery} from './ListMode';
import Loading from './Loading';

const containerStyle = {
  width: '100%',
  height: '700px'
};

const mapStyle = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text",
        "stylers": [
	        {
	        	"color": "#d1bba1"
	        },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f1e5d5"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ebd8c3"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
        	{
        		"color": "#f1e5d5"
        	},
            {
                "saturation": 0
            },
            {
                "lightness": 0
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [
        {"color":"#ffffff"},
            {
                "visibility": "on"
            },
            {
                "lightness": "31"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
        	{"color":"#ffffff"},
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f1e5d5"
            }
        ]
    }
];

const options = {
  styles: mapStyle
};

const nyc = {
  lat: 40.740,
  lng: -74.006
};

const sf = { lat: 37.783, lng: -122.421 };

function MapMode(props) {

	const mapRef = useRef();
	const [info, setInfo] = useState({
		open: false,
		index: -1
	})
	const [locations, setLoc] = useState([]);

	useEffect(() => {
		setLoc(props.restaurants);
	}, [props.restaurants]);

	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`,
		libraries: ['places']
		// ...otherOptions
	});

	if (loadError) {
		return <div>Map cannot be loaded right now, sorry.</div>
	}

	// const onLoad = (mapInstance) => {
 //        mapRef.current = mapInstance;
 //    };

    const popUp = (index) => {
    	setInfo({open: true, index: index});
    }

	return (
		<div className="map-container">
			{(isLoaded && props.loaded) ? 
				<GoogleMap
				  center={nyc}
				  zoom={14}
				  mapContainerStyle={containerStyle}
				  options={options}
				>
				  {
				    locations.map((r, i) => {
						return (
							<CustomMarker res={locations[i]} index={i} key={i} selectedMarker={info.index} setInfo={setInfo} fetchData={props.fetchData} />
						);
					})
				  }
				</GoogleMap>
			:
				<Loading />
			}
		</div>
	);
}

const markerOp = {
	collisionBehavior: 'REQUIRED_AND_HIDES_OPTIONAL'
};

function CustomMarker(props) {

	const index = useRef(props.index);
	const options = {
		//disableAutoPan: true
	}

	const getUrl = () => {
		if(props.res.cuisine.includes('Bagels')) {
			return (process.env.PUBLIC_URL + '/bagel.png');
		} else if(props.res.category.includes('Rooftop')) {
			return (process.env.PUBLIC_URL + '/cocktail.png');
		} else if(props.res.cuisine.includes('Pizza')) {
			return (process.env.PUBLIC_URL + '/pizza.png');
		} else if(props.res.cuisine.includes('Bakery')) {
			return (process.env.PUBLIC_URL + '/bakery.png');
		} else if(props.res.cuisine.includes('Tea')) {
			return (process.env.PUBLIC_URL + '/tea.png');
		} else if(props.res.cuisine.includes('Coffee')) {
			return (process.env.PUBLIC_URL + '/coffee.png');
		} else if(props.res.cuisine.includes('Ice Cream')) {
			return (process.env.PUBLIC_URL + '/icecream.png');
		} else if(props.res.cuisine.includes('Mediterranean')) {
			return (process.env.PUBLIC_URL + '/mediterranean.png');
		} else if(props.res.cuisine.includes('Korean')) {
			return (process.env.PUBLIC_URL + '/korean.png');
		} else if(props.res.cuisine.includes('Japanese')) {
			return (process.env.PUBLIC_URL + '/japanese.png');
		} else if(props.res.cuisine.includes('Mexican')) {
			return (process.env.PUBLIC_URL + '/mexican.png');
		} else if(props.res.cuisine.includes('Italian')) {
			return (process.env.PUBLIC_URL + '/italian.png');
		} else if(props.res.cuisine.includes('Dim Sum')) {
			return (process.env.PUBLIC_URL + '/dumpling.png');
		} else if(props.res.cuisine.includes('Chinese')) {
			return (process.env.PUBLIC_URL + '/chinese.png');
		} else if(props.res.cuisine.includes('French')) {
			return (process.env.PUBLIC_URL + '/french.png');
		} else if(props.res.cuisine.includes('Bar')) {
			return (process.env.PUBLIC_URL + '/beer.png');
		} else if(props.res.cuisine.includes('Vegan')) {
			return (process.env.PUBLIC_URL + '/vegan.png');
		} else if(props.res.cuisine.includes('Asian') || props.res.cuisine.includes('Thai') || props.res.cuisine.includes('Southeast Asian') || props.res.cuisine.includes('Vietnamese') || props.res.cuisine.includes('Filipino') || props.res.cuisine.includes('Taiwanese')) {
			return (process.env.PUBLIC_URL + '/asian.png');
		} else if(props.res.category.includes('Brunch')) {
			return (process.env.PUBLIC_URL + '/avocado.png');
		} else if(props.res.category.includes('Desserts')) {
			return (process.env.PUBLIC_URL + '/dessert.png');
		} 
		else {
			return (process.env.PUBLIC_URL + '/restaurant.png');
		}
	}

	return (
		<div>
			<Marker 
			  position={{lat: props.res.lat, lng: props.res.lng}} 
			  onClick={() => props.setInfo({open: true, index: index.current})} 
			  icon={{url: getUrl(), scaledSize: {width: 32, height: 32}}}
			  options={markerOp}
		  	>
				{props.selectedMarker === index.current &&
				<InfoWindow position={{lat: props.res.lat, lng: props.res.lng}} options={options}>
					<Eatery res={props.res} fetchData={props.fetchData} />
				</InfoWindow>
				}
			</Marker>
		</div>
	);
}

export default React.memo(MapMode);