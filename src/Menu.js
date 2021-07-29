import React, { useEffect, useState, useRef } from 'react';
import {multiFilter} from './parseData';
import xPic from './close.png';

const subcategories = {
	'Asian': ['Southeast Asian', 'Chinese', 'Japanese', 'Korean', 'Taiwanese', 'Thai', 'Vietnamese', 'Filipino', 'Indian'],
	'Southeast Asian': ['Thai', 'Vietnamese', 'Filipino', 'Malaysian'],
	'American': ['Southern'],
	'Chinese': ['Dim Sum']
};

function Menu(props) {

	const [filters, setFilters] = useState({
		cuisine: "All",
		category: "All",
		location: [],
		price: "All"
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
					  {props.labels.cuisines.map(c => <option value={c}>{c}</option>)}
					</select>
				</label>
				<label>
					Category
					<select value={filters.category} name="category" onChange={handleChange}>
					  {props.labels.categories.map(c => <option value={c}>{c}</option>)}
					</select>
				</label>
				{/*<label>
					Location
					<select value={filters.location} name="location" onChange={handleChange}>
					  {props.labels.locations.map(c => <option value={c}>{c}</option>)}
					</select>
				</label>*/}
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
		</div>
	);
}

function MultiSelect(props) {

	const [selected, setSelected] = useState([]);
	const [labels, setLabels] = useState([]);
	const [open, setOpen] = useState(false);
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

	const check = (value) => {
		let tempArr = selected;
		if(tempArr.includes(value)) {
			tempArr = tempArr.filter(v => v !== value);
			//if(tempArr.length === 0) tempArr = [];
		} else {
			if(tempArr[0] !== 'Any') {
				tempArr.push(value);
			} else {
				tempArr = [value];
			}
		}
		let temp = [...labels];
		let index = temp.findIndex(l => l.name === value);
		let obj = temp[index];
		obj.checked = !obj.checked;
		props.setFilters({...props.filters, [props.name]: tempArr});
		if(tempArr.length === 0) setSelected(['Any']);
		else setSelected(tempArr);
	}

	const handleClick = () => {
		if(!open) setOpen(true);
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
					{labels.map(op => <label><CheckBox handleClick={() => check(op.name)} checked={op.checked}/>{op.name}</label>)}
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

	const handleClick = () => {
		setChecked(!checked);
		props.handleClick();
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