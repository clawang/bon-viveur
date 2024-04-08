import React, { useState, useEffect } from 'react';
import { searchGoogle, addData } from './util/addData';
import xPic from './assets/close.png';

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

	const [name, setName] = useState('');
	const [data, setData] = useState({
		cuisine: [],
		category: [],
		location: []
	});
	const [price, setPrice] = useState(0);
	const [rating, setRating] = useState(0.0);
	const [otherCuisine, setOtherCuisine] = useState('');
	const [otherLocation, setOtherLocation] = useState('');
	const [otherCategory, setOtherCategory] = useState('');
	const [status, setStatus] = useState(0); //0 is unsent, 1 is client error, 2 is success, 3 is servor error
	const [errorMessage, setError] = useState('');
	const [open, setOpen] = useState(true);
	const [results, setResults] = useState([]);
	const [labels, setLabels] = useState(props.labels);
	const [output, setOutput] = useState("");

	useEffect(() => {
		setLabels(props.labels);
	}, [props.labels]);

	const updateName = (event) => {
		setName(event.target.value);
	}

	const handleChange = (event, name) => {
		let newLabels = { ...labels };
		const item = newLabels[event.target.name].find(element => element.name === name);
		item.checked = !item.checked;
		setLabels(newLabels);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setStatus(0);
		setError('');

		let cuisines = labels.cuisines.filter(label => label.checked).map(label => label.name);
		if (otherCuisine && cuisines.indexOf(otherCuisine) < 0) cuisines.push(otherCuisine);
		let locations = labels.locations.filter(label => label.checked).map(label => label.name);
		if (otherLocation && locations.indexOf(otherLocation) < 0) locations.push(otherLocation);
		let categories = labels.categories.filter(label => label.checked).map(label => label.name);
		if (otherCategory && categories.indexOf(otherCategory) < 0) categories.push(otherCategory);
		setData({ cuisine: cuisines, category: categories, location: locations });

		if (validateInput({ cuisine: cuisines, category: categories, location: locations })) {
			const info = {
				name,
				cuisine: cuisines,
				category: data.category,
				location: data.location,
				price: Number(price),
				rating: Number(rating)
			};

			const tempResults = await searchGoogle(info, props.center);
			setResults(tempResults);
		}
	}

	const addLocation = async (locData, index) => {
		console.log(locData);

		const info = [
			name,
			data.cuisine.reduce((prev, cur) => prev + '|' + cur),
			data.category.reduce((prev, cur) => prev + '|' + cur),
			locData.addressComponents?.filter(component => component.types.includes("neighborhood"))?.[0]?.longText,
			locData.addressComponents?.filter(component => component.types.includes("locality"))?.[0]?.longText,
			price,
			locData.location.lat,
			locData.location.lng,
			rating
		];

		setOutput(output.concat(info.join(",") + "\n"));

		let tempResults = [...results];
		tempResults[index].success = true
		setResults(tempResults);
		// }
	}

	const validateInput = (inputData) => {
		if (inputData.cuisine.length <= 0) {
			setError('No cuisines were selected.');
		} else if (inputData.category.length <= 0) {
			setError('No categories were selected.');
			// } else if (inputData.location.length <= 0) {
			// 	setError('No locations were selected.');
		} else if (!name) {
			setError('You must include a name.');
		} else if (props.restaurants.findIndex(res => res.name === name) >= 0) {
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
		setRating(0.0);
		setOtherCuisine('');
		setOtherCategory('');
		labels.cuisines.forEach(cuisine => cuisine.checked = false);
		labels.locations.forEach(location => location.checked = false);
		labels.categories.forEach(category => category.checked = false);
		document.getElementById("input-form").reset();
	}

	return (
		<>
			{results.length > 0 ?
				<div className="dialog-wrapper">
					<div className="dialog input">
						<p className="close" onClick={() => setResults([])}><img src={xPic} style={{ width: '10px' }} alt="close" /></p>
						{results.map((loc, i) => {
							return (
								<div style={{ display: "flex" }}>
									<div>
										<h3>{loc.displayName}</h3>
										<p>{loc.addressComponents.reduce((agg, curr) => agg += curr.longText + ", ", "")}</p>
										<p>Price Level: {loc.priceLevel}</p>
										<p>Business Status: {loc.businessStatus}</p>
									</div>
									<button className={loc.success ? "success-button" : ""} onClick={() => addLocation(loc, i)}>+</button>
								</div>
							)
						})}
						{status >= 1 ?
							<div className={"status-bar " + statuses[status].class}>
								<p>{status === 2 ? statuses[status].message : errorMessage}</p>
							</div>
							:
							<></>
						}
					</div>
				</div>
				:
				<></>
			}
			<div className={"input-form" + (open ? "" : " minimized")}>
				<div className="minimize-icon" onClick={() => setOpen(!open)}>{open ? "–" : "+"}</div>
				<form onSubmit={handleSubmit} id="input-form">
					<div className="input-section title">
						<p>What is the name of the restuarant?</p>
						<input type="text" value={name} onChange={updateName} />
					</div>
					<div className="input-section">
						<p>What cuisine is this restuarant?</p>
						<div className="input-options" style={{ height: (labels.cuisines.length / 2 * 25 + 40) + 'px' }}>
							{labels.cuisines.map((cuisine) =>
								<label>
									<input type="checkbox" name="cuisines" value={cuisine.name} onChange={(e) => handleChange(e, cuisine.name)} checked={!!cuisine.checked} />
									{cuisine.name}
								</label>
							)}
							<label>
								<input type="checkbox" checked={otherCuisine} />
								Other:<input type="text" value={otherCuisine} onChange={e => setOtherCuisine(e.target.value)} />
							</label>
						</div>
					</div>
					<div className="input-section">
						<p>What categories does it fall under?</p>
						<div className="input-options" style={{ height: (labels.categories.length / 2 * 25 + 40) + 'px' }}>
							{labels.categories.map((category) =>
								<label>
									<input type="checkbox" name="categories" value={category.name} onChange={(e) => handleChange(e, category.name)} checked={!!category.checked} />
									{category.name}
								</label>
							)}
							<label>
								<input type="checkbox" checked={otherCategory} />
								Other:
								<input type="text" value={otherCategory} onChange={e => setOtherCategory(e.target.value)} />
							</label>
						</div>
					</div>
					{/* <div className="input-section">
						<p>Where are the locations?</p>
						<div className="input-options" style={{ height: (labels.locations.length / 2 * 25 + 40) + 'px' }}>
							{labels.locations.map((location) =>
								<label>
									<input type="checkbox" name="locations" value={location.name} onChange={(e) => handleChange(e, location.name)} checked={!!location.checked} />
									{location.name}
								</label>
							)}
							<label>
								<input type="checkbox" checked={otherLocation} />
								Other:<input type="text" value={otherLocation} onChange={e => setOtherLocation(e.target.value)} />
							</label>
						</div>
					</div> */}
					<div className="input-section">
						<p>What price range is it?</p>
						<input type="number" min="1" max="4" value={price} onChange={e => setPrice(e.target.value)} />
					</div>
					<div className="input-section">
						<p>What would you rate it out of 5?</p>
						<input type="number" min="0.0" max="5.0" value={rating} step="0.1" onChange={e => setRating(e.target.value)} />
					</div>
					<input type="reset" onClick={clearForm} />
					<input type="submit" />
					{status >= 1 ?
						<div className={"status-bar " + statuses[status].class}>
							<p>{status === 2 ? statuses[status].message : errorMessage}</p>
						</div>
						:
						<></>
					}
				</form>
			</div>
			<div className="csv-text">
				<h2>Output:</h2>
				<textarea readOnly value={output}></textarea>
			</div>
		</>
	);
}

export default Input;