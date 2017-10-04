const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    trips: Array
});

module.exports = CustomerSchema;
