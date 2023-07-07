import React, { useEffect, useState, useRef } from 'react';
import {multiFilter} from './parseData';
import xPic from './close.png';

const subcategories = {
	'Asian': ['Southeast Asian', 'Chinese', 'Japanese', 'Korean', 'Taiwanese', 'Thai', 'Vietnamese', 'Filipino', 'Indian', 'Nepalese'],
	'Southeast Asian': ['Thai', 'Vietnamese', 'Filipino', 'Malaysian', 'Burmese', 'Laotian'],
	'American': ['Southern'],
	'Chinese': ['Dim Sum'],
	'Scandinavian': ['Danish'],
	'Latin American': ['South American','Mexican','Peruvian','Venezuelan'],
	'South American': ['Peruvian','Venezuelan','Brazilian','Argentinian']
};

function Menu(props) {

	const [filters, setFilters] = useState({
		cuisine: "All",
		category: "All",
		location: [],
		price: "All",
		name: "",
		sort: "rating"
	});

	useEffect(() => {
		let tempArr = filter();
		//console.log(tempArr);
		props.setRes(tempArr);
	}, [filters]);

	const handleChange = (evt, num) => {
		setFilters({...filters, [evt.target.name]: evt.target.value});
	};

	const filter = () => {
		let tempArr = props.restaurants;
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
		if(filters.price !== "All") tempArr = tempArr.filter(r => r.price == filters.price);
		if(tempArr[0]) {
			tempArr[0].best = true;
		}
		if(filters.sort === "rating") {
			tempArr.sort((a,b) => Number(b.rating) - Number(a.rating));
		}
		return tempArr;
	}

	const reset = (e) => {
		e.preventDefault();
		setFilters({cuisine: "All", category: "All", location: [], price: "All"});
	}

	const random = (e) => {
		e.preventDefault();
		let tempArr = filter();
		let index = Math.floor(Math.random() * tempArr.length);
		props.setRes([tempArr[index]]);
	}

	return (
		<div className="cuisines">
			<form>
				<label>
					Cuisine
					<select value={filters.cuisine} name="cuisine" onChange={handleChange}>
					  <option value="All">All</option>
					  {props.labels.cuisines.map(c => <option value={c}>{c}</option>)}
					</select>
				</label>
				<label>
					Category
					<select value={filters.category} name="category" onChange={handleChange}>
					  <option value="All">All</option>
					  {props.labels.categories.map(c => <option value={c}>{c}</option>)}
					</select>
				</label>
				<label>
					Location
					<MultiSelect name={'location'} options={props.labels.locations} filters={filters} setFilters={setFilters} />
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
				<button onClick={reset}>Reset</button>
				<button onClick={random}>Random</button>
			</form>
			{props.devMode ? 
				<form>
					<label> Search
						<input type="text" placeholder="Search name of restaurant" name="name" onChange={handleChange}></input>
					</label>
					<label> Sort
						<select value={filters.sort} name="sort" onChange={handleChange}>
						  <option value="recent">Recent</option>
						  <option value="rating">Rating</option>
						</select>
					</label>
				</form>
				:
				<></>
			}
		</div>
	);
}

function MultiSelect(props) {

	const [selected, setSelected] = useState([]);
	const [labels, setLabels] = useState([]);
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState({
		previous: -1,
		check: true
	});
	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef, open, setOpen);

	useEffect(() => {
		setSelected(['Any']);
	}, []);

	useEffect(() => {
		resetLabels();
	}, [props.options]);

	useEffect(() => {
		if(props.filters[props.name].length <= 0) {
			resetLabels();
			setSelected(['Any']);
		}
	}, [props.filters]);

	const check = (event, value) => {
		//console.log(event.shiftKey);
		let tempList = selected;
		let selecting = tempList.includes(value) ? false : true;
		let tempLabels = [...labels];
		let index = tempLabels.findIndex(l => l.name === value);
		if(event.shiftKey && options.previous >= 0) {
			let start = Math.min(options.previous, index);
			let end = Math.max(options.previous, index);
			for(let i = start; i <= end; i++) {
				console.log("multi");
				let obj = tempLabels[i];
				obj.checked = selecting;
				tempList = updateItem(tempList, i, obj.name, selecting);
			}
		} else {
			let obj = tempLabels[index];
			obj.checked = selecting;
			tempList = updateItem(tempList, index, value, selecting);
		}
		console.log(tempList);
		props.setFilters({...props.filters, [props.name]: tempList});
		if(tempList.length === 0) setSelected(['Any']);
		else setSelected(tempList);
		setOptions({...options, previous: index});
	}

	const updateItem = (tempList, index, name, selecting) => {
		console.log("selecting: "+index);
		if(selecting) {
			if(tempList[0] !== 'Any') tempList.push(name);
			else tempList = [name];
		} else {
			tempList = tempList.filter(v => v !== name);
		}
		return tempList;
	};

	const handleClick = () => {
		setOpen(!open);
	}

	const getLabel = () => {
		let str = "";
		selected.forEach((s, i) => {
			if(i > 0) str += ", ";
			str += s;
		});
		return str;
	}

	const resetLabels = () => {
		let tempArr = props.options.map(m => {return {name: m, checked: false}});
		setLabels(tempArr);
	}

	const remove = () => {
		setSelected(['Any']);
		resetLabels();
		props.setFilters({...props.filters, [props.name]: []});
		setOpen(false);
	}

	//console.log(selected);

	return (
		<div className="multiselect-wrapper" ref={wrapperRef}>
			<div className="multiselect" onClick={handleClick}>
				<div className="multiselect-show">
					{getLabel()}
				</div>
			</div>
			{open ?
				<div className="multiselect-options">
					{labels.map((op, i) => <label key={i}><CheckBox handleClick={(e) => check(e, op.name)} checked={op.checked} /><p>{op.name}</p></label>)}
				</div>
				:
				<div></div>
			}
			<div className="remove-all" onClick={remove}><img src={xPic} style={{width: '10px'}}/></div>
		</div>
	);
}

function CheckBox(props) {
	const [checked, setChecked] = useState(props.checked);

	useEffect(() => {
		setChecked(props.checked);
	}, [props.checked]);

	const handleClick = (e) => {
		setChecked(!checked);
		props.handleClick(e);
	}

	return (
		<div className={"custom-checkbox" + (checked ? " checked" : "")} onClick={handleClick}/>
	);
}

function useOutsideAlerter(ref, state, setState) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target) && state) {
                //alert("You clicked outside of me!");
                setState(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [state]);
}

export default Menu;