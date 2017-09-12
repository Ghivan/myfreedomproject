const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

module.exports = LocationSchema;