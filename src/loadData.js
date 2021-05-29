import React, { useEffect, useState } from 'react';
import { CSVLink, CSVDownload } from "react-csv";

const headers = [
  { label: "name", key: "name" },
  { label: "cuisine", key: "cuisine" },
  { label: "category", key: "category" },
  { label: "location", key: "price" },
  { label: "lat", key: "lat" },
  { label: "long", key: "long" }
];

function Write(props) {
	return <CSVDownload data={props.data} headers={headers} target="_blank" />;
}

export default Write;