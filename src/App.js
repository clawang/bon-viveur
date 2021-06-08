import React, { useEffect, useState, useRef } from 'react';
import {extractProp, parse} from './parseData';
import {ListMode} from './ListMode';
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
import './style.scss';

function App() {

	const [restaurants, setRes] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [list, setList] = useState(false);
	const [cuisines, setCuisines] = useState([]);
	const [categories, setCategories] = useState([]);
	const [locations, setLocations] = useState([]);
	const [curRes, setCurRes] = useState([]);
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
		location: "All",
		price: "All"
	});

	useEffect(() => {
		csvJSON();
	}, []);

	useEffect(() => {
		//console.log(props.restaurants);
		let cuisinesTemp = extractProp("cuisine", restaurants);
		setCuisines(["All", ...cuisinesTemp]);
		let catTemp = extractProp("category", restaurants);
		setCategories(["All", ...catTemp]);
		let locationsTemp = extractProp("location", restaurants);
		setLocations(["All", ...locationsTemp]);
		setCurRes(restaurants);
	}, [restaurants]);

	useEffect(() => {
		let tempArr = restaurants;
		if(filters.cuisine !== "All") tempArr = tempArr.filter(r => r.cuisine.includes(filters.cuisine));
		if(filters.category !== "All") tempArr = tempArr.filter(r => r.category.includes(filters.category));
		if(filters.location !== "All") tempArr = tempArr.filter(r => r.location.includes(filters.location));
		if(filters.price !== "All") tempArr = tempArr.filter(r => r.price == filters.price);
		setCurRes(tempArr);
	}, [filters]);

	useEffect(() => {
		console.log('scroll change');
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

	const handleChange = (evt, num) => {
		setFilters({...filters, [evt.target.name]: evt.target.value});
	};

	const reset = () => {
		setFilters({cuisine: "All", category: "All", location: "All", price: "All"});
	}

	const random = (e) => {
		e.preventDefault();
		let tempArr = curRes;
		let index = Math.floor(Math.random() * curRes.length);
		setCurRes([tempArr[index]]);
	}

	const fetchData = (rest) => {
		loadData(rest, appState, setAppState);
	}

	//console.log(appState);

	return (
		<div className="App">
			<header className="App-header">
				<h1>BON VIVEUR</h1>
				<h2>New York City</h2>
				<div onClick={() => setList(!list)} className='nav'><img src={list ? mapIcon : listIcon} style={{width:'100%'}}/></div>
				<div className="cuisines">
					<form>
						<label>
							Cuisine
							<select value={filters.cuisine} name="cuisine" onChange={handleChange}>
							  {cuisines.map(c => <option value={c}>{c}</option>)}
							</select>
						</label>
						<label>
							Category
							<select value={filters.category} name="category" onChange={handleChange}>
							  {categories.map(c => <option value={c}>{c}</option>)}
							</select>
						</label>
						<label>
							Location
							<select value={filters.location} name="location" onChange={handleChange}>
							  {locations.map(c => <option value={c}>{c}</option>)}
							</select>
						</label>
						<label>
							Price
							<select value={filters.price} name="price" onChange={handleChange}>
							  <option value="All">All</option>
							  <option value="1">$</option>
							  <option value="2">$$</option>
							  <option value="3">$$$</option>
							  <option value="4">$$$$</option>
							</select>
						</label>
						<input type="reset" onClick={reset}/>
						<button onClick={random}>Random</button>
					</form>
				</div>
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
				<p className="close" onClick={props.close}>X</p>
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
