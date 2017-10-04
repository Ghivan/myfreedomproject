const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
//Routes
const customers = require('./customers/router');
const locations = require('./locations/router');
const trips = require('./trips/router');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.get('/', ((req,res) => {
    res.send('index page');
}));

router.use('/customers', customers);
router.use('/locations', locations);
router.use('/trips', trips);

module.exports = router;
