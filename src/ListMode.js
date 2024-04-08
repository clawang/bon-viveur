import React, { useEffect, useState } from 'react';
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
				curRes.map((res, i) => <Eatery res={res} fetchData={props.fetchData} key={i} index={i} />)
				:
				<Loading />
			}
		</div>
	);
}

function Eatery(props) {

	const strToPrice = () => {
		let str = "";
		for (let i = 0; i < props.res.price; i++) {
			str += "$";
		}
		return str;
	}

	return (
		<div className={"eatery "/* + (props.index === 0 ? "best" : "")*/}>
			<div className="eatery-content">
				<h3 onClick={() => props.fetchData(props.res)}>{props.res.name}</h3>
				<p className="eatery-cuisines">{strToPrice()} | {props.res.cuisine.map((c, i) => {
					if (i === 0) return c;
					return ", " + c;
				})}</p>
				<p className="eatery-city">{props.res.city}</p>
				<p className="eatery-locations">{props.res.location.join(", ")}</p>
			</div>
		</div>
	);
}

export { Eatery, ListMode };