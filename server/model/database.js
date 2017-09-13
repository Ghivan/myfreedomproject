const mongoose = require('mongoose');
const LocationSchema = require('./schemas/location');
const TripSchema = require('./schemas/trip');
const DBNames = {
    LOCATIONS: 'locations',
    TRIPS: 'trips'
};

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/touristsDB', {useMongoClient: true});


const LocationModel = mongoose.model(DBNames.LOCATIONS, LocationSchema);
const TripModel = mongoose.model(DBNames.TRIPS, TripSchema);

const transform = model => {
    const obj = model.toObject();
    obj.id = obj._id;
    delete obj.__v;
    delete obj._id;
    return obj;
};

module.exports = {
    LocationModel,
    TripModel,
    transform
};
