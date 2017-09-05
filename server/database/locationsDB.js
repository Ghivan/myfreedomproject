const express = require('express');
const path = require('path');
const fs = require('fs');
const DBSource = require('./database');

const locations = {
    getAll: () => DBSource.getAll('locations'),
    getById: (id) => DBSource.getAll('locations').then((data) => data.find(location => location.id === id))

};

module.exports = locations;