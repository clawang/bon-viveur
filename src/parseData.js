const parse = (str) => {
	let data = str.split('\n').map(i=>i.split(','));
	let headers = data.shift();
	data = data.filter(d => d.length >= 7);
	let output = data.map(d=>{
		let obj = {};
		headers.map((h,i)=> {
			if(headers[i] === "cuisine" || headers[i] === "location" || headers[i] === "category") {
				let arr = d[i].split('|');
				obj[headers[i]] = arr;
			} else if(headers[i] === "lat" || headers[i] === "lng") {
				obj[headers[i]] = parseFloat(d[i]);
			} else {
				let str = d[i].trim();
				obj[headers[i]] = str;
			}
		});
		return obj;
	});
	return output;
};

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

export {parse, extractProp};