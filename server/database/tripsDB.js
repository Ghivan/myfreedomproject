const express = require('express');
const path = require('path');
const fs = require('fs');
const DBSource = require('./database');

const trips = {
    getAll: () => DBSource.getAll('trips'),
    getById: (id) => DBSource.getAll('trips').then((data) => data.find(trip => trip.id === id)),
    add: (data) => DBSource.write('trips', data)
};

module.exports = trips;