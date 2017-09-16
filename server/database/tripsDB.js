const express = require('express');
const path = require('path');
const fs = require('fs');
const DBSource = require('./database');

const trips = {
    getAll: () => DBSource.getAll('trips'),
    getById: (id) => DBSource.getAll('trips').then((data) => data.find(trip => trip.id === id)),
    add: (data) => DBSource.write('trips', data),
    setLocationsNames : (trips , locations) =>{
        trips.map(trip =>
            trip.route.locations = trip.route.locations.map(id =>{
                    let location = locations.find(location => location.id === id);
                    return location.city + ' (' + location.country + ')'
                }
            ).join(', '));
    }
};

module.exports = trips;