import React, { useEffect, useState, useRef } from 'react';
import {extractProp} from './parseData';
import Loading from './Loading';

function ListMode(props) {

	const [curRes, setCurRes] = useState([]);

	useEffect(() => {
		let temp = props.restaurants;
		temp = temp.filter((r, i, arr) => arr.findIndex(f => f.name === r.name) === i);
		setCurRes(temp);
	}, [props.restaurants]);

	return (
		<div className="eateries-wrapper">
			{props.loaded ? 
				curRes.map((res, i) => <Eatery res={res} fetchData={props.fetchData} key={i} />)
				:
				<Loading />
			}
		</div>
	);
}

function Eatery(props) {

	const strToPrice = () => {
		let str = "";
		for(let i = 0; i < props.res.price; i++) {
			str += "$";
		}
		return str;
	}

	return (
		<div className="eatery">
			<h3 onClick={() => props.fetchData(props.res)}>{props.res.name}</h3>
			<p className="eatery-cuisines">{props.res.cuisine.map((c, i) => {
				if(i === 0) return c;
				return ", " + c;
			})} | {strToPrice()}</p>
			<p>{props.res.location.map((c, i) => {
				if(i === 0) return c;
				return ", " + c;
			})}</p>
		</div>
	);
}

export {Eatery, ListMode};