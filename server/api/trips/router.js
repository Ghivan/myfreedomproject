const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const router = express.Router();
const rootDir = path.dirname(require.main.filename);
const {TripModel, LocationModel, transform} = require(path.join(rootDir, 'model', 'database'));
const Validator = require(path.join(rootDir, 'model', 'validators'));


router.get('/', (req, res, next) => {
    Promise.all([TripModel.find(), LocationModel.find()]).then(([trips, locations]) => {
        trips = trips.map(trip => {
            trip.route.locations = trip.route.locations.map(tripLoc =>
                transform(locations.find(location => location._id.toString() === tripLoc.toString()))
            );
            return transform(trip);
        });
        res.json(trips);
    }, next)
});

router.get('/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(404);
        res.end();
        return next('Invalid trip Id');
    }
    TripModel.findById(req.params.id)
        .then(trip => {
            if (trip){
                LocationModel.find({_id :{ $in: trip.route.locations }}).then(locations => {
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
    if (!Array.isArray(requestedLocations)) requestedLocations = [requestedLocations];
    const errors = {
        TRIP_NAME_IS_EMPTY: !Validator.text(name),
        LOCATIONS_IS_EMPTY: requestedLocations.length <= 0,
        ARRIVAL_DATE_IS_NOT_VALID: !Validator.date(arrivalDate),
        DEPARTURE_DATE_IS_NOT_VALID: !Validator.date(departureDate),
        DEPARTURE_IS_SOONER_ARRIVAL: new Date(arrivalDate) > new Date(departureDate)
    };

    if (errors.TRIP_NAME_IS_EMPTY || errors.ARRIVAL_DATE_IS_NOT_VALID ||
        errors.DEPARTURE_DATE_IS_NOT_VALID || errors.LOCATIONS_IS_EMPTY ||
        errors.DEPARTURE_IS_SOONER_ARRIVAL){
        res.status(400);
        res.json(errors);
        res.end();
        return next();
    }
    requestedLocations.map(location => {
        try{
            location = mongoose.Types.ObjectId(location)
        } catch (e) {
            res.status(400);
            res.json('Invalid locations id');
            res.end();
            return next(new Error('Invalid locations id'));
        }
    });

    TripModel.findOne({name: new RegExp(name, 'i')}).then(trip => {
        if (!trip){
            LocationModel.find({_id :{ $in: requestedLocations }}).then(locations => {
                if (locations.length !== requestedLocations.length){
                    res.status(400);
                    res.json('Check locations existence!');
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
                res.status(201);
                NewTrip.save().then(trip => res.json(transform(trip)), next);
            })
        } else {
            res.status(200);
            res.json(transform(trip));
            res.end();
        }
    });
});


router.put('/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(404);
        res.end();
        return next();
    }
    let {name, arrivalDate, departureDate} = req.body;
    let requestedLocations = null;
    let errors = [];

    if (req.body.locations) {
        if (!Array.isArray(req.body.locations)){
            requestedLocations = [req.body.locations];
        } else {
            requestedLocations = req.body.locations;
        }
        requestedLocations.map(locationId => {
            try{
                locationId = mongoose.Types.ObjectId(locationId)
            } catch (e) {
                errors.push('Invalid locations id');
            }
        });
    }

    if (name){
        if (!Validator.text(name)){
            errors.push('Invalid trip\'s name');
        } else {
            name = name.trim()
        }
    }

    if (arrivalDate) {
        if (!Validator.date(arrivalDate)){
            errors.push('Invalid arrival date');
        } else {
            arrivalDate = new Date(arrivalDate)
        }
    }

    if (departureDate) {
        if (!Validator.date(departureDate)){
            errors.push('Invalid departure date');
        } else {
            departureDate = new Date(departureDate)
        }
    }

    if (errors.length > 0){
        res.status(400);
        res.json(errors);
        res.end();
        return next();
    }

    TripModel.findById(req.params.id).then(trip => {
        if (!trip) {
            res.status(404);
            res.end();
            return next();
        }

        if (name) trip.name = name;
        if (arrivalDate) {
            if (new Date(trip.route.departureDate) < arrivalDate) {
                res.status(400);
                res.json('New arrival date is later than departure date');
                res.end();
                return next();
            } else {
                trip.route.arrivalDate = arrivalDate;
            }
        }
        if (departureDate){
            if (new Date(trip.route.arrivalDate) > departureDate) {
                res.status(400);
                res.json('New departure date is sooner than arrival date');
                res.end();
                return next();
            } else {
                trip.route.departureDate = departureDate;
            }
        }
        if (requestedLocations){
            LocationModel.find({_id :{ $in: requestedLocations }}).then(locations => {
                if (locations.length !== requestedLocations.length){
                    res.status(400);
                    res.json('Check locations existence!');
                    res.end();
                    return next();
                }

                trip.route.locations = requestedLocations;
                trip.save().then(trip => res.json(transform(trip)), next);
            })
        } else {
            trip.save().then(trip => res.json(transform(trip)), next);
        }

    })

});

router.delete('/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(200);
        res.end();
        return next();
    }
    TripModel.findById(req.params.id)
        .then(trip => {
                if (trip){
                    trip.remove();
                    res.json(transform(trip));
                } else {
                    res.status(200);
                    res.end();
                }
            }, next
        );
});

router.all((err, req, res, next) => {
    console.log(err)
});
module.exports = router;
