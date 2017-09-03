const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const customersDB = path.join(__dirname, 'database/customers.json');
const locationsDB = path.join(__dirname, 'database/locations.json');
const tripsDB = path.join(__dirname, 'database/trips.json');



const getLocationsDB = () => new Promise((resolve, reject) =>
    fs.readFile(locationsDB, 'utf8', (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    })).then(data => JSON.parse(data));

const getTripsDB = () => new Promise((resolve, reject) => {
    getLocationsDB().then(locations => {
        fs.readFile(tripsDB, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                let trips = JSON.parse(data);
                trips.map(trip => trip.route.location = locations.find(location => location.id === trip.route.location));
                resolve(trips);
            }
        })
    }
    ).catch(error => reject(error))
}).then(data => data);

const getCustomersDB = () => new Promise((resolve, reject) =>
    fs.readFile(customersDB, 'utf8', (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    })).then(data => JSON.parse(data));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Tourist\'s agency'
    });
});

app.get('/customers', (req, res) => {
    app.locals.title = 'Customers';
    res.render('customers');
});

app.get('/locations', (req, res) => {
    app.locals.title = 'Locations';
    getLocationsDB().then(data => {
        app.locals.locations = data;
        res.render('locations');
    });
});

app.get('/trips', (req, res) => {
    app.locals.title = 'Trips';
    getTripsDB().then(data => {
        app.locals.trips = data;
        res.render('trips');
    });
});

app.listen(3000, () => {
    console.log('Server works on port 3000.');
});