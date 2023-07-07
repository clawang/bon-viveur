import React, { useEffect, useState, useRef } from 'react';
import {extractProp, parse} from './parseData';
import {ListMode} from './ListMode';
import Menu from './Menu';
import Input from './Input';
import MapMode from './MapMode';
import Loading from './Loading';
import restaurantsCSV from './Restaurants.csv';
import sfCSV from './sfRestaurants.csv';
import listIcon from './list.png';
import mapIcon from './map.png';
import loadData from './loadData';
import filledStar from './star.png';
import unfilledStar from './unfilled.png';
import halfStar from './halfstar.png';
import pin from './mappin.png';
import phone from './phone.png';
import yelp from './yelp.png';
import xPic from './close.png';
import csv from './world.csv';
import './style.scss';

const cityData = [
	{
		name: 'New York City',
		csv: restaurantsCSV
	},
	{
		name: 'San Francisco',
		csv: sfCSV
	},
	{
		name: 'World',
		csv: csv
	}
];

function App() {

	const [restaurants, setRes] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [list, setList] = useState(false);
	const [labels, setLabels] = useState({
		cuisines: [],
		categories: [],
		locations: []
	});
	const [curRes, setCurRes] = useState([]);
	const [appState, setAppState] = useState({
		open: false,
		loading: false,
		error: false,
		data: {},
		rest: {}
	});
	const [city, setCity] = useState(-1); //0 is nyc, 1 is sf, 2 is world
	const devMode = false;
	const enable_world = devMode;
	
	useEffect(() => {
		if(city >= 0) csvJSON();
	}, [city]);

	useEffect(() => {
		let cuisinesTemp = extractProp("cuisine", restaurants, true);
		//console.log(cuisinesTemp);
		let catTemp = extractProp("category", restaurants, true);
		let locationsTemp = extractProp("location", restaurants, false);
		const newLabels = {cuisines: [...cuisinesTemp], categories: [...catTemp], locations: [...locationsTemp]};
		if(city === 2) {
			let temp = extractProp("area", restaurants, true);
			// locationsTemp.concat(temp);
		}
		//console.log(newLabels);
		setLabels(newLabels);
		setCurRes(restaurants);
	}, [restaurants]);

	useEffect(() => {
		if(appState.open || appState.loading) {
			document.body.classList.add('no-scroll');
		} else {
			document.body.classList.remove('no-scroll');
		}
	}, [appState]);
	
	const csvJSON = () => {
		const csvName = cityData[city].csv;
		fetch(csvName)
		.then(response => response.text())
		.then(transform);
	}

	const transform = (str) => {
		let output = parse(str);
		setRes(output);
		//console.log(output.length);
		setLoaded(true);
	}

	const fetchData = (rest) => {
		loadData(rest, appState, setAppState);
	}

	return (
		<div className="App">
			{city < 0 ?
				<div className="city-selection-wrapper">
					<div className="city-selection">
						<h1>Which city would you like to see?</h1>
						{(enable_world ? cityData : cityData.filter(city => city.name !== 'World'))
							.map((data, index) => <p onClick={() => setCity(index)}>{data.name}</p>)}
					</div>	
				</div>
				:
				<div>
					<header className="App-header">
						<h1 onClick={() => setCity(-1)}>BON VIVEUR</h1>
						<h2>{cityData[city].name}</h2>
						<div onClick={() => setList(!list)} className='nav'><img src={list ? mapIcon : listIcon} style={{width:'100%'}}/></div>
						<Menu setRes={setCurRes} restaurants={restaurants} city={city} labels={labels} devMode={devMode}/>
					</header>
					{devMode ? <Input labels={labels} city={city} restaurants={curRes} /> : <></>}
					{(appState.loading || appState.open) ? <PopUp state={appState} data={appState.data} close={() => setAppState({...appState, open: false})} /> : <div></div>}
					{list ? 
						<ListMode restaurants={curRes} fetchData={fetchData} loaded={loaded} />
						:
						<MapMode restaurants={curRes} loaded={loaded} fetchData={fetchData} cityCode={city} />
					}
				</div>
			}
		</div>
	);
}

function PopUp(props) {

	let stars = [];
	let filled = Math.floor(props.data.rating);
	for(let i = 0; i < filled; i++) {
		stars.push('filled');
	}
	let half = 0;
	if(props.data.rating % 1 !== 0) {
		stars.push('half');
		half = 1;
	} 
	let unfilled = 5 - filled - half;
	for(let i = 0; i < unfilled; i++) {
		stars.push('unfilled');
	}

	const numToPrice = (pr) => {
		let str = "";
		for(let i = 0; i < pr; i++) {
			str += "$";
		}
		return str;
	}

	return (
		<div className="dialog-wrapper">
			<div className="dialog">
				<p className="close" onClick={props.close}><img src={xPic} style={{width: '10px'}}/></p>
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
							{props.data.is_closed ? <p className="closed">permanently closed</p>: ''}
							<div className="star-container">
								<div className="star-wrapper">
									{stars.map((type, index) => <DisplayStar type={type} key={index} />)}
								</div>
								<p>{" | " + (props.data.price || numToPrice(props.state.rest.price))}</p>
							</div>
							<h4>{props.data.categories.map((c, i) => {
								let str = "";
								if(i > 0) str += ", ";
								str += c.title;
								return str;
							})}</h4>

							<div className="dialog-info">
								<img src={pin} />
								<p><a href={"https://maps.google.com/?q="+props.data.location.display_address[0] + ", " + props.data.location.display_address[1]} target="_blank">{props.data.location.display_address[0] + ", " + props.data.location.display_address[1]}</a></p>
							</div>
							<div className="dialog-info">
								<img src={phone} />
								<p>{props.data.display_phone || "N/A"}</p>
							</div>
							<div className="dialog-info">
								<img src={yelp} />
								<p><a href={props.data.url} target="_blank">Yelp</a></p>
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
		<img src={src[props.type]} alt="restaurant" className="star" />
	);
}

export default App;
