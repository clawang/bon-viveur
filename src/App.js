import React, { useEffect, useState, useRef } from 'react';
import {extractProp, parse} from './parseData';
import {ListMode} from './ListMode';
import Menu from './Menu';
import MapMode from './MapMode';
import Loading from './Loading';
import restaurantsCSV from './Restaurants.csv';
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
import './style.scss';

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
	

	useEffect(() => {
		csvJSON();
	}, []);

	useEffect(() => {
		//console.log(props.restaurants);
		let cuisinesTemp = extractProp("cuisine", restaurants);
		let catTemp = extractProp("category", restaurants);
		let locationsTemp = extractProp("location", restaurants);
		setLabels({cuisines: ["All", ...cuisinesTemp], categories: ["All", ...catTemp], locations: [...locationsTemp]});
		setCurRes(restaurants);
	}, [restaurants]);


	useEffect(() => {
		//console.log('scroll change');
		if(appState.open || appState.loading) {
			document.body.classList.add('no-scroll');
		} else {
			document.body.classList.remove('no-scroll');
		}
	}, [appState]);
	
	const csvJSON = () => {
		fetch(restaurantsCSV)
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

	return (
		<div className="App">
			<header className="App-header">
				<h1>BON VIVEUR</h1>
				<h2>New York City</h2>
				<div onClick={() => setList(!list)} className='nav'><img src={list ? mapIcon : listIcon} style={{width:'100%'}}/></div>
				<Menu setRes={setCurRes} restaurants={restaurants} labels={labels}/>
			</header>
			{(appState.loading || appState.open) ? <PopUp state={appState} data={appState.data} close={() => setAppState({...appState, open: false})} /> : <div></div>}
			{list ? 
				<ListMode restaurants={curRes} fetchData={fetchData} loaded={loaded} />
				:
				<MapMode restaurants={curRes} setRes={setRes} loaded={loaded} fetchData={fetchData} />
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
