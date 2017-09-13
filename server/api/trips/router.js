const express = require('express');
const path = require('path');

const router = express.Router();
const rootDir = path.dirname(require.main.filename);
const {TripModel, LocationModel, transform} = require(path.join(rootDir, 'model', 'database'));
const Validator = require(path.join(rootDir, 'model', 'validators'));


router.get('/', (req, res, next) => {
    TripModel.find().then(trips => {
        LocationModel.find().then(locations => {
            trips = trips.map(trip => {
                trip.route.locations = trip.route.locations.map(tripLoc =>
                    transform(locations.find(location => location._id.toString() === tripLoc.toString()))
                );
                return transform(trip);
            });
            res.json(trips);
        });
    }, next)
});

router.get('/:id', (req, res, next) => {
    TripModel.findById(req.params.id).then(trip => {
        LocationModel.find({_id :{ $in: trip.route.locations }}).then(locations => {
            trip.route.locations = trip.route.locations.map(tripLoc =>
                transform(locations.find(location => location._id.toString() === tripLoc.toString())));
            res.json(transform(trip));
        });
    }, next)
});

router.all((err, req, res, next) => {
    res.status(500);
    res.send(err);
});
module.exports = router;