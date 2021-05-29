const {Client, PlaceInputType} = require("@googlemaps/google-maps-services-js");
const prompt = require('prompt-sync')();
const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'Restaurants.csv',
  header: [
    {id: 'name', title: 'name'},
    {id: 'cuisine', title: 'cuisine'},
    {id: 'category', title: 'category'},
    {id: 'location', title: 'location'},
    {id: 'price', title: 'price'},
    {id: 'lat', title: 'lat'},
    {id: 'lng', title: 'lng'},
  ]
});

const client = new Client({});
let count;
const restaurants = [];

const getApi = (name, index, callback) => {
  let arr = restaurants[index].location.split('|');
  client
    .placesNearby({
      params: {
        keyword: name,
        //inputtype: PlaceInputType.textQuery,
        location: { lat: 40.740, lng: -74.006 },
        key: "AIzaSyAsBasMtERBic_FV-rLd7CULK6hbXXH5ro",
        radius: 3200,
        fields: ["name", "formatted_address", "geometry"]
      },
      timeout: 1000, // milliseconds
    })
    .then((r) => {
      //console.log(r.data.candidates[0].name);
      if(arr.length > 1) console.log(r.data.results[0].geometry);
      if(arr.length === 1) {
        callback(r.data.results[0].geometry.location, index);
      } else {
        for(let i = 1; i < arr.length; i++) {
          let obj = {...restaurants[index]};
          obj.lat = r.data.results[i].geometry.location.lat;
          obj.lng = r.data.results[i].geometry.location.lng;
          restaurants.push(obj);
        }
        callback(r.data.results[0].geometry.location, index);
      }
    })
    .catch((e) => {
      console.log(e.response.data.error_message);
    });
};

const getLatLong = () => {
  restaurants.forEach((res, index) => {
    setTimeout(() => {
      getApi(res.name, index, (data, i) => {
        restaurants[i].lat = data.lat;
        restaurants[i].lng = data.lng;
        //console.log(restaurants[i]);
        if(i == count - 1) {
          csvWriter
          .writeRecords(restaurants)
          .then(()=> console.log('The CSV file was written successfully'));
        }
      });
    }, 100*index);
  });
}

fs.createReadStream('./src/restaurants.csv')
  .pipe(csv())
  .on('data', (row) => {
    restaurants.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    count = restaurants.length;
    getLatLong();
  });

// const name = prompt('What restaurant are you looking for?');
// console.log(`looking for ${name}`);
// getApi(name);