const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');

const router = express.Router();
const {CustomerModel, TripModel, LocationModel, transform} = require('../../model/database');
const Validator = require('../../model/validators');

const {escapeRegExp} = require('../../utils');

router.get('/', (req, res, next) => {
    Promise.all([TripModel.find(), LocationModel.find()]).then(([trips, locations]) => {
        const normalizedLocations = _.keyBy(locations.map(transform), location => location.id);
        trips.forEach(trip => {
            trip.route.locations = trip.route.locations.map(locationId => normalizedLocations[locationId]);
        });
        res.json(trips.map(transform));
    }, next)
});

router.get('/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404);
        res.end();
        return next('Invalid trip Id');
    }
    TripModel.findById(req.params.id)
        .then(trip => {
            if (trip) {
                LocationModel.find({_id: {$in: trip.route.locations}}).then(locations => {
                    trip.route.locations = trip.route.locations.map(tripLoc =>
                        transform(locations.find(location => location._id.toString() === tripLoc.toString())));
                    res.json(transform(trip));
                });
            } else {
                res.status(404);
                res.end();
            }

        }, next)
});

router.post('/', (req, res, next) => {
    let {name, arrivalDate, departureDate} = req.body;
    let requestedLocations = req.body.locations || [];

    const errors = {
        TRIP_NAME_IS_EMPTY: !Validator.text(name),
        LOCATIONS_IS_EMPTY: requestedLocations.length <= 0,
        ARRIVAL_DATE_IS_NOT_VALID: !Validator.date(arrivalDate),
        DEPARTURE_DATE_IS_NOT_VALID: !Validator.date(departureDate),
        DEPARTURE_IS_SOONER_ARRIVAL: new Date(arrivalDate) > new Date(departureDate),
        toString: () => {
            let message = '';
            if (this.TRIP_NAME_IS_EMPTY) message += ' You should provide trip name.';
            if (this.LOCATIONS_IS_EMPTY) message += ' You should provide trip\'s locations.';
            if (this.ARRIVAL_DATE_IS_NOT_VALID) message += ' Arrival date is not valid.';
            if (this.DEPARTURE_DATE_IS_NOT_VALID) message += ' Departure date is not valid.';
            if (this.DEPARTURE_IS_SOONER_ARRIVAL) message += ' Departure is sooner than arrival.';
            return message;
        }
    };

    if (errors.TRIP_NAME_IS_EMPTY || errors.ARRIVAL_DATE_IS_NOT_VALID ||
        errors.DEPARTURE_DATE_IS_NOT_VALID || errors.LOCATIONS_IS_EMPTY ||
        errors.DEPARTURE_IS_SOONER_ARRIVAL) {
        res.statusMessage = errors.toString();
        res.status(400);
        res.json({
            error: 'Errors in sent data',
            details: errors
        });
        res.end();
        return next();
    }
    requestedLocations.map(location => {
        try {
            location = mongoose.Types.ObjectId(location)
        } catch (e) {
            res.statusMessage = 'Invalid locations id';
            res.status(400);
            res.end();
        }
    });

    TripModel.findOne({name: new RegExp('^' + escapeRegExp(name) + '$', 'i')}).then(trip => {
        if (!trip) {
            LocationModel.find({_id: {$in: requestedLocations}}).then(locations => {
                if (locations.length !== requestedLocations.length) {
                    res.statusMessage = 'Check locations existence!';
                    res.end();
                    return next();
                }
                const NewTrip = new TripModel({
                    name: name.trim(),
                    route: {
                        locations: requestedLocations,
                        arrivalDate: new Date(arrivalDate),
                        departureDate: new Date(departureDate)
                    }
                });
                res.status(200);
                NewTrip.save().then(trip => {
                    LocationModel.find().then(locations => {
                        const normalizedLocations = _.keyBy(locations.map(transform), location => location.id);
                        trip.route.locations = trip.route.locations.map(locationId => normalizedLocations[locationId]);
                        res.json(transform(trip))
                    })
                }, next);
            })
        } else {
            res.statusMessage = 'Trip already exists';
            res.status(400);
            res.end();
        }
    });
});


router.put('/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(404);
        res.end();
        return next();
    }
    let {name, arrivalDate, departureDate} = req.body;
    let requestedLocations = null;
    let errors = [];

    if (req.body.locations) {
        requestedLocations = req.body.locations;
        requestedLocations.map(locationId => {
            try {
                locationId = mongoose.Types.ObjectId(locationId)
            } catch (e) {
                errors.push('Invalid locations id');
            }
        });
    }

    if (name) {
        if (!Validator.text(name)) {
            errors.push('Invalid trip\'s name');
        } else {
            name = name.trim()
        }
    }

    if (arrivalDate) {
        if (!Validator.date(arrivalDate)) {
            errors.push('Invalid arrival date');
        } else {
            arrivalDate = new Date(arrivalDate)
        }
    }

    if (departureDate) {
        if (!Validator.date(departureDate)) {
            errors.push('Invalid departure date');
        } else {
            departureDate = new Date(departureDate)
        }
    }

    if (errors.length > 0) {
        res.statusMessage = errors.join(' ');
        res.status(400);
        res.end();
        return next();
    }

    TripModel.findById(req.params.id).then(trip => {
        if (!trip) {
            res.status(404);
            res.end();
            return next();
        }

        if (name) {
            trip.name = name;
        }

        if (arrivalDate) {
            if (new Date(trip.route.departureDate) < arrivalDate) {
                res.statusMessage = 'New arrival date is later than departure date';
                res.status(400);
                res.end();
                return next();
            } else {
                trip.route.arrivalDate = arrivalDate;
            }
        }
        if (departureDate) {
            if (new Date(trip.route.arrivalDate) > departureDate) {
                res.statusMessage = 'New departure date is sooner than arrival date';
                res.status(400);
                res.end();
                return next();
            } else {
                trip.route.departureDate = departureDate;
            }
        }
        if (requestedLocations) {
            LocationModel.find({_id: {$in: requestedLocations}}).then(locations => {
                if (locations.length !== requestedLocations.length) {
                    res.statusMessage = 'Check locations existence!';
                    res.status(400);
                    res.end();
                    return next();
                }
                trip.route.locations = requestedLocations;
                trip.save().then(trip => {
                    trip.route.locations = locations.map(transform);
                    res.json(transform(trip))
                }, next);
            })
        } else {
            trip.save().then(trip => res.json(transform(trip)), next);
        }

    })

});

router.delete('/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(200);
        res.end();
        return next();
    }
    TripModel.findById(req.params.id)
        .then(trip => {
                CustomerModel.find({
                    'trips': {$in: [req.params.id]}
                }).then(customers => {
                    if (customers.length > 0) {
                        res.statusMessage = 'Trip is used by Customers';
                        res.status(400);
                        res.end();
                    } else {
                        trip.remove();
                        res.json(transform(trip));
                    }
                });
            }, next
        );
});

router.all((err, req, res, next) => {
    console.log(err)
});
module.exports = router;
