const mongoose = require('mongoose');
const LocationSchema = require('./shemas/location');
const DBNames = {
  LOCATIONS: 'locations'
};

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/touristsDB', {useMongoClient: true});


const LocationModel = mongoose.model(DBNames.LOCATIONS, LocationSchema);

module.exports = {
    LocationModel
};
