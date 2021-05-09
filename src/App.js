import React, { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';
import restaurantsCSV from './Restaurants.csv';
import './style.scss';

function App() {

	const restaurants = useRef([]);
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
		let tempArr = restaurants.current;
		if(filters.cuisine !== "All") tempArr = tempArr.filter(r => r.Cuisine.includes(filters.cuisine));
		if(filters.category !== "All") tempArr = tempArr.filter(r => r.Category.includes(filters.category));
		if(filters.location !== "All") tempArr = tempArr.filter(r => r.Location.includes(filters.location));
		if(filters.price !== "All") tempArr = tempArr.filter(r => r.Price == filters.price);
		setCurRes(tempArr);
	}, [filters]);

	const csvJSON = () => {
		fetch(restaurantsCSV)
		.then(response => response.text())
		.then(transform);
	}

	const transform = (str) => {
		let data = str.split('\n').map(i=>i.split(','));
		let headers = data.shift();
		let output = data.map(d=>{
			let obj = {};
			headers.map((h,i)=> {
				if(headers[i] === "Cuisine" || headers[i] === "Location" || headers[i] === "Category") {
					let arr = d[i].split('|');
					obj[headers[i]] = arr;
				} else {
					let str = d[i].trim();
					obj[headers[i]] = str;
				}
			});
			return obj;
		});
		restaurants.current = output;
		let cuisinesTemp = extractProp("Cuisine", output);
		setCuisines(["All", ...cuisinesTemp]);
		let catTemp = extractProp("Category", output);
		setCategories(["All", ...catTemp]);
		let locationsTemp = extractProp("Location", output);
		setLocations(["All", ...locationsTemp]);
		//console.log(output);
		setCurRes(output);
	}

	const extractProp = (prop, arr) => {
		let temp = [];
		for(let i = 0; i < arr.length; i++) {
			let c = arr[i][prop];
			for(let j = 0; j < c.length; j++) {
				if(!temp.includes(c[j]) && c[j] !== "") {
					temp.push(c[j]);
				}
			}
		}
		temp.sort();
		return temp;
	};

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
			<div className="eateries-wrapper">
				{curRes.map(res => <Eatery name={res.Name} cuisine={res.Cuisine} locations={res.Location} price={res.Price} />)}
			</div>
		</div>
	);
}

function Cuisine(props) {

	const edit = () => {
		props.setFilters({...props.filters, cuisine: props.name});
	}

	return (
		<h4 onClick={edit} className="cuisine-title">{props.name}</h4>
	);
}

function Eatery(props) {

	const strToPrice = () => {
		let str = "";
		for(let i = 0; i < props.price; i++) {
			str += "$";
		}
		return str;
	}

	return (
		<div className="eatery">
			<h3>{props.name}</h3>
			<p className="eatery-cuisines">{props.cuisine.map((c, i) => {
				if(i === 0) return c;
				return ", " + c;
			})} | {strToPrice()}</p>
			<p>{props.locations.map((c, i) => {
				if(i === 0) return c;
				return ", " + c;
			})}</p>
		</div>
	);
}

export default App;
