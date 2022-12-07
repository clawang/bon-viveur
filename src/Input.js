import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const statuses = [
	{
		name: 'Unsent',
		class: ''
	},
	{
		name: 'client error',
		class: 'warning'
	},
	{
		name: 'Success',
		class: 'success',
		message: 'Success! Your restaurant has been added.'
	},
	{
		name: 'server error',
		class: 'error',
		message: 'Sorry, there was an error. Please try again.'
	}
];

function Input(props) {

	const [labels, setLabels] = useState(props.labels);
	const [name, setName] = useState('');
	const [data, setData] = useState({
		cuisine: [],
		category: [],
		location: []
	});
	const [price, setPrice] = useState(0);
	const [otherCuisine, setOtherCuisine] = useState('');
	const [otherLocation, setOtherLocation] = useState('');
	const [status, setStatus] = useState(0); //0 is unsent, 1 is client error, 2 is success, 3 is servor error
	const [errorMessage, setError] = useState('');
	const [open, setOpen] = useState(true);

	useEffect(() => {
		let newLabels = props.labels;
		newLabels.cuisines.shift();
		newLabels.categories.shift();
		setLabels(newLabels);
	}, [props.labels]);

	const updateName = (event) => {
		setName(event.target.value);
	}

	const handleChange = (event) => {
		let newArr = data[event.target.name];
		if(event.target.checked) {
			newArr.push(event.target.value);
		} else {
			newArr.splice(newArr.indexOf(event.target.value));
		}
		setData({...data, [event.target.name]: newArr});
	}

	const handleSubmit = (e) => {
	    e.preventDefault();
	    setStatus(0);
	    setError('');

	    if(validateInput()) {
		    if(otherCuisine && data.cuisine.indexOf(otherCuisine) < 0) data.cuisine.push(otherCuisine);
		    if(otherLocation && data.location.indexOf(otherLocation) < 0) data.location.push(otherLocation);

		    const info = {
		      name,
		      cuisine: data.cuisine.reduce((prev, cur) => prev + '|' + cur),
		      category: data.category.reduce((prev, cur) => prev + '|' + cur),
		      location: data.location.reduce((prev, cur) => prev + '|' + cur),
		      price: Number(price)
		    };

		    const city = props.city === 0 ? 'nyc' : 'sf';
		    const url = 'http://localhost:8000/' + city;

		    axios
		      .post(url, info)
		      .then((res) => {
		      	console.log(res);
		      	if(res.data === 'success!') {
		      		setStatus(2);
		      		clearForm();
		      	} else {
		      		setStatus(3);
		      		setError(res.data);
		      	}
		      })
		      .catch(err => {
		        console.log(err);
		        setStatus(3);
		      });
		}
	}

	const validateInput = () => {
		if(data.cuisine.length <= 0 && !otherCuisine) {
			setError('No cuisines were selected.');
		} else if(data.category.length <= 0) {
			setError('No categories were selected.');
		} else if(data.location.length <= 0 && !otherLocation) {
			setError('No locations were selected.');
		} else if(!name) {
			setError('You must include a name.');
		} else if(props.restaurants.findIndex(res => res.name === name) >= 0) {
			setError('You already added that restaurant.');
		} else {
			return true;
		}
		setStatus(1);
		return false;
	}

	const clearForm = () => {
		setName('');
		setData({
			cuisine: [],
			category: [],
			location: []
		});
		setPrice(0);
		setOtherCuisine('');
		setOtherLocation('');
		document.getElementById("input-form").reset();
	}

	return (
		<div className={"input-form" + (open ? "" : " minimized")}>
			<div className="minimize-icon" onClick={() => setOpen(!open)}>{open ? "–" : "+"}</div>
			<form onSubmit={handleSubmit} id="input-form">
				<div className="input-section title">
					<p>What is the name of the restuarant?</p>
					<input type="text" value={name} onChange={updateName} />
				</div>
				<div className="input-section">
					<p>What cuisine is this restuarant?</p>
					<div className="input-options" style={{height: (props.labels.cuisines.length/2 * 25) + 'px'}}>
						{props.labels.cuisines.map((cuisine) =>
							<label><input type="checkbox" name="cuisine" value={cuisine} onChange={handleChange} />{cuisine}</label>
						)}
						<label><input type="checkbox" checked={otherCuisine} />Other:<input type="text" value={otherCuisine} onChange={e => setOtherCuisine(e.target.value)}/></label>
					</div>
				</div>
				<div className="input-section">
					<p>What categories does it fall under?</p>
					<div className="input-options" style={{height: (props.labels.categories.length/2 * 25) + 'px'}}>
						{props.labels.categories.map((category) =>
							<label><input type="checkbox" name="category" value={category} onChange={handleChange} />{category}</label>
						)}
					</div>
				</div>
				<div className="input-section">
					<p>Where are the locations?</p>
					<div className="input-options" style={{height: (props.labels.locations.length/2 * 25) + 'px'}}>
						{props.labels.locations.map((location) =>
							<label><input type="checkbox" name="location" value={location} onChange={handleChange} />{location}</label>
						)}
						<label><input type="checkbox" checked={otherLocation} />Other:<input type="text" value={otherLocation} onChange={e => setOtherLocation(e.target.value)}/></label>
					</div>
				</div>
				<div className="input-section">
					<p>What price range is it?</p>
					<input type="number" min="1" max="4" value={price} onChange={e => setPrice(e.target.value)} />
				</div>
				<input type="reset" onClick={clearForm}/>
				<input type="submit"/>
				{status >= 1 ?
					<div className={"status-bar " + statuses[status].class}>
						<p>{status === 2 ? statuses[status].message : errorMessage}</p>
					</div>
					:
					<></>
				}
			</form>
		</div>
	);
}

export default Input;