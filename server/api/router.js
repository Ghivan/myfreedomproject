const express = require('express');
const router = express.Router();

//Routes
const customers = require('./customers/router');
const locations = require('./locations/router');
const trips = require('./trips/router');

router.use('/customers', customers);
router.use('/locations', locations);
router.use('/trips', trips);

module.exports = router;