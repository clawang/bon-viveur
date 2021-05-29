const {Client, PlaceInputType} = require("@googlemaps/google-maps-services-js");
const prompt = require('prompt-sync')();
const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: './src/Restaurants.csv',
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
const restaurants = [];
const newRes = {};

const getApi = (name) => {
  let arr = newRes.location.split('|');
  client
    .placesNearby({
      params: {
        keyword: name,
        //inputtype: PlaceInputType.textQuery,
        location: { lat: 40.740, lng: -74.006 },
        key: "AIzaSyAsBasMtERBic_FV-rLd7CULK6hbXXH5ro",
        radius: 5000,
        fields: ["name", "formatted_address", "geometry"]
      },
      timeout: 1000, // milliseconds
    })
    .then((r) => {
        for(let i = 0; i < arr.length; i++) {
          let obj = {...newRes};
          obj.lat = r.data.results[i].geometry.location.lat;
          obj.lng = r.data.results[i].geometry.location.lng;
          restaurants.push(obj);
        }
        csvWriter
      .writeRecords(restaurants)
      .then(()=> console.log('The CSV file was written successfully'));
      //   callback(r.data.results[0].geometry.location, index);
      // }
    })
    .catch((e) => {
      console.log(e.response.data.error_message);
    });
};

fs.createReadStream('./src/Restaurants.csv')
  .pipe(csv())
  .on('data', (row) => {
    restaurants.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    const name = prompt('What restaurant are you looking for?');
    newRes.name = name;
    newRes.cuisine = prompt('What cuisine is this restaurant?');
    console.log('What categories does it fall under?');
    console.log('(Bar,Brunch,Cafe,Date Night,Desserts')
    newRes.category = prompt('Drinks,Lunch/Dinner,Quick Bites,Rooftop,Tea)');
    newRes.location = prompt('Where are the locations?');
    newRes.price = prompt('What price range is it?');
    getApi(name);
  });

