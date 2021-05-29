import React, { useEffect, useState, useRef } from 'react';
import {extractProp, parse} from './parseData';
import {ListMode} from './ListMode';
import MapMode from './MapMode';
import restaurantsCSV from './Restaurants.csv';
import listIcon from './list.png';
import mapIcon from './map.png';
import './style.scss';

function App() {

	const [restaurants, setRes] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [list, setList] = useState(false);
	const [cuisines, setCuisines] = useState([]);
	const [categories, setCategories] = useState([]);
	const [locations, setLocations] = useState([]);
	const [curRes, setCurRes] = useState([]);
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

	return (
		<div className="App">
			<header className="App-header">
				<h1>BON VIVEUR</h1>
				<h2>New York City</h2>
				<div onClick={() => setList(!list)} className='nav'><img src={list ? mapIcon : listIcon} style={{width:'100%'}}/></div>
			</header>
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
				</form>
			</div>
			{loaded ? 
				(
					list ? 
					<ListMode restaurants={curRes} />
					:
					<MapMode restaurants={curRes} setRes={setRes} />
				)
				:
				<p>loading...</p>
			}
		</div>
	);
}

export default App;
