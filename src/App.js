import React, { useEffect, useState, useRef, useMemo } from 'react';
import { extractProp, parse } from './util/parseData';
import { ListMode } from './ListMode';
import { getDistance, getLatFromZoom } from './util/mapUtil';
import {multiFilter} from './util/parseData';
import { reverseGeocode } from './api/google-maps';
import restaurantsCSV from './assets/restaurants.csv';
import Menu from './Menu';
import Input from './Input';
import MapMode from './MapMode';
import Loading from './Loading';
import listIcon from './assets/list.png';
import mapIcon from './assets/map.png';
import { loadData } from './util/loadData';
import filledStar from './assets/star.png';
import unfilledStar from './assets/unfilled.png';
import halfStar from './assets/halfstar.png';
import pin from './assets/mappin.png';
import phone from './assets/phone.png';
import yelp from './assets/yelp.png';
import xPic from './assets/close.png';
import './style.scss';

const cityData = [
	{
		name: 'New York City',
		location: { lat: 40.724, lng: -73.978 },
		zoom: 14
	},
	{
		name: 'San Francisco',
		location: { lat: 37.768, lng: -122.444 },
		zoom: 13
	},
	{
		name: 'Boston',
		location: { lat: 42.351, lng: -71.072 },
		zoom: 13.5
	},
	{
		name: 'Los Angeles',
		location: { lat: 34.051, lng: -118.371 },
		zoom: 12
	}
];

const subcategories = {
	'Asian': ['Southeast Asian', 'Chinese', 'Japanese', 'Korean', 'Taiwanese', 'Thai', 'Vietnamese', 'Filipino', 'Indian', 'Nepalese'],
	'Southeast Asian': ['Thai', 'Vietnamese', 'Filipino', 'Malaysian', 'Burmese', 'Laotian'],
	'American': ['Southern'],
	'Chinese': ['Dim Sum'],
	'Scandinavian': ['Danish'],
	'Latin American': ['South American','Mexican','Peruvian','Venezuelan','Salvadoran'],
	'South American': ['Peruvian','Venezuelan','Brazilian','Argentinian']
};

function App() {
	const [restaurants, setRes] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [list, setList] = useState(false);
	const [appState, setAppState] = useState({
		open: false,
		loading: false,
		error: false,
		data: {},
		rest: {}
	});
	const [filters, setFilters] = useState({
		cuisine: "All",
		category: "All",
		location: [],
		price: "All",
		name: "",
		sort: "rating"
	});
	const [city, setCity] = useState(1); //0 is nyc, 1 is sf, 2 is world
	const [cityName, setCityName] = useState("");
	const [center, setCenter] = useState(cityData[city].location);
	const [zoom, setZoom] = useState(cityData[city].zoom);
	const devMode = false;

	const pastLocation = useRef({ lat: 0, lng: 0 });

	useEffect(() => {
		// getRestaurantsFromFirestore();
		csvJSON();
	}, []);

	const getLabels = () => {
		const tempRestaurants = restaurants.filter(value =>
			getDistance({ lat: value.lat, lng: value.lng }, center) < getLatFromZoom(zoom) / 35000
		);
		let cuisinesTemp = extractProp("cuisine", tempRestaurants, true);
		let catTemp = extractProp("category", tempRestaurants, true);
		let locationsTemp = extractProp("location", tempRestaurants, false);
		return { cuisines: [...cuisinesTemp], categories: [...catTemp], locations: [...locationsTemp] };
	}

	const labels = useMemo(() => getLabels(), [restaurants, center, zoom]);

	const filter = () => {
		let tempArr = restaurants.filter(value =>
			getDistance({ lat: value.lat, lng: value.lng }, center) < getLatFromZoom(zoom) / 35000
		);
		if(filters.name) {
			tempArr = tempArr.filter(r => r.name.toLowerCase().includes(String(filters.name).toLowerCase()));
			return tempArr;
		}
		if(filters.cuisine !== "All") {
			if(subcategories.hasOwnProperty(filters.cuisine)) {
				//console.log('subcat');
				let subc = subcategories[filters.cuisine];
				tempArr = tempArr.filter(r => {
					let bool = false;
					subc.forEach(sc => {
						//console.log(sc);
						if(r.cuisine.includes(sc)) {
							bool = true;
						}
					});
					if(bool) return true;
					else return r.cuisine.includes(filters.cuisine);
				});
			}
			else tempArr = tempArr.filter(r => r.cuisine.includes(filters.cuisine));
		}
		if(filters.category !== "All") tempArr = tempArr.filter(r => r.category.includes(filters.category));
		if(filters.location.length > 0) {
			tempArr = multiFilter(tempArr, 'location', filters.location);
		}
		if(filters.price !== "All") tempArr = tempArr.filter(r => r.price === filters.price);
		if(tempArr[0]) {
			tempArr[0].best = true;
		}
		if(filters.sort === "rating") {
			tempArr.sort((a,b) => Number(b.rating) - Number(a.rating));
		}
		return tempArr;
	}

	const curRes = useMemo(() => filter(), [restaurants, filters, center]);

	useEffect(() => {
		setCenter(cityData[city].location);
		setZoom(cityData[city].zoom);
	}, [city]);

	useEffect(() => {
		getCityName();
	}, [center]);

	useEffect(() => {
		if (appState.open || appState.loading) {
			document.body.classList.add('no-scroll');
		} else {
			document.body.classList.remove('no-scroll');
		}
	}, [appState]);

	const csvJSON = () => {
		const csvName = restaurantsCSV;
		fetch(csvName)
		.then(response => response.text())
		.then(transform);
	}

	const transform = (str) => {
		let output = parse(str);
		setRes(output);
		setLoaded(true);
	}

	const fetchData = (rest) => {
		loadData(rest, appState, setAppState);
	}

	const getCityName = async () => {
		if (getDistance(pastLocation.current, center) > 0.144927) {
			pastLocation.current = center;
			const name = await reverseGeocode(center);
			if (name) {
				setCityName(name);
			}
		}
	}

	return (
		<div className="App">
			<div className="App-header">
				<div onClick={() => setList(!list)} className='nav'>
					<img src={list ? mapIcon : listIcon} style={{ width: '100%' }} alt={list ? "map" : "list"} />
				</div>
				<h1>BON VIVEUR</h1>
				<h2>{cityName ?? cityData[city].name}</h2>
				<Menu
					cities={cityData}
					city={city}
					setCity={setCity}
					filters={filters}
					setFilters={setFilters}
					labels={labels}
					devMode={devMode}
				/>
				{devMode ? <Input labels={labels} city={city} restaurants={curRes} center={center} /> : <></>}
			</div>
			{
				(appState.loading || appState.open) ?
					<PopUp state={appState} data={appState.data} close={() => setAppState({ ...appState, open: false })} />
					:
					<></>
			}
			<div className="content-wrapper">
				{list ?
					<ListMode
						restaurants={curRes}
						fetchData={fetchData}
						loaded={loaded}
					/>
					:
					<MapMode
						restaurants={curRes}
						loaded={loaded}
						fetchData={fetchData}
						cityCode={city}
						setCityName={setCityName}
						center={center}
						setCenter={setCenter}
						zoom={zoom}
						setZoom={setZoom}
					/>
				}
			</div>
		</div>
	);
}

function PopUp(props) {

	let stars = [];
	let filled = Math.floor(props.data.rating);
	for (let i = 0; i < filled; i++) {
		stars.push('filled');
	}
	let half = 0;
	if (props.data.rating % 1 !== 0) {
		stars.push('half');
		half = 1;
	}
	let unfilled = 5 - filled - half;
	for (let i = 0; i < unfilled; i++) {
		stars.push('unfilled');
	}

	const numToPrice = (pr) => {
		let str = "";
		for (let i = 0; i < pr; i++) {
			str += "$";
		}
		return str;
	}

	return (
		<div className="dialog-wrapper">
			<div className="dialog">
				<p className="close" onClick={props.close}><img src={xPic} style={{ width: '10px' }} alt="close" /></p>
				{props.state.loading
					?
					<Loading />
					:
					(
						props.state.error
							?
							<h4>There was an error.</h4>
							:
							<div className="dialog-content">
								<h3>{props.data.name}</h3>
								{props.data.is_closed ? <p className="closed">permanently closed</p> : ''}
								<div className="star-container">
									<div className="star-wrapper">
										{stars.map((type, index) => <DisplayStar type={type} key={index} />)}
									</div>
									<p>{" | " + (props.data.price || numToPrice(props.state.rest.price))}</p>
								</div>
								<h4>{props.data.categories.map((c, i) => {
									let str = "";
									if (i > 0) str += ", ";
									str += c.title;
									return str;
								})}</h4>

								<div className="dialog-info">
									<img src={pin} alt="pin" />
									<p>
										<a href={"https://maps.google.com/?q=" + props.data.location.display_address[0] + ", " + props.data.location.display_address[1]} target="_blank" rel="noreferrer">
											{props.data.location.display_address[0] + ", " + props.data.location.display_address[1]}
										</a>
									</p>
								</div>
								<div className="dialog-info">
									<img src={phone} alt="phone" />
									<p>{props.data.display_phone || "N/A"}</p>
								</div>
								<div className="dialog-info">
									<img src={yelp} alt="yelp" />
									<p><a href={props.data.url} target="_blank" rel="noreferrer">Yelp</a></p>
								</div>
							</div>
					)
				}
			</div>
		</div>
	);
}

function DisplayStar(props) {
	const src = {
		'filled': filledStar,
		'unfilled': unfilledStar,
		'half': halfStar
	};
	return (
		<img src={src[props.type]} alt="star" className="star" />
	);
}

export default App;
