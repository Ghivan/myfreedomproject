const mongoose = require('mongoose');

const TripSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    route: {
        locations: Array,
        arrivalDate: Date,
        departureDate: Date
    }
});

module.exports = TripSchema;