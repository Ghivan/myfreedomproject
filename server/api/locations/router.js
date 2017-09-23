const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const router = express.Router();
const rootDir = path.dirname(require.main.filename);
const {TripModel, LocationModel, transform} = require(path.join(rootDir, 'model', 'database'));
const Validator = require(path.join(rootDir, 'model', 'validators'));

const {escapeRegExp} = require('../../utils');

router.get('/', (req, res, next) => {
    LocationModel.find().then(locations => res.json(locations.map(transform)), next)
});

router.get('/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(404);
        res.end();
        return next();
    }
    LocationModel.findById(req.params.id).then(location => {
        if (location) {
            res.json(transform(location))
        } else {
            res.status(404);
            res.end();
        }
    }, next)
});

router.post('/', (req, res, next) => {
    const {city, country} = req.body;
    const errors = {
        CITY_IS_EMPTY: !Validator.text(city),
        COUNTRY_IS_EMPTY: !Validator.text(country)
    };

    if (errors.CITY_IS_EMPTY || errors.COUNTRY_IS_EMPTY){
        res.status(400);
        res.json({error: "Empty fields", details: errors});
        res.end();
        return next();
    }

    LocationModel.findOne({city: new RegExp('^' + escapeRegExp(city) + '$', 'i'), country: new RegExp('^' + escapeRegExp(country) + '$', 'i')}).then(location => {
        if (!location){
            const NewLocation = new LocationModel({
                    city: city.trim(),
                    country: country.trim()
                }
            );
            NewLocation.save().then(location => {
                    res.status(201);
                    res.json(transform(location))
                }, next
            );
        } else {
            res.status(400);
            res.json({
                error: 'Location already exists',
                details: transform(location)});
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
    LocationModel.findById(req.params.id).then(location => {
        if (!location) {
            res.status(404);
            res.end();
            return next();
        }

        const {city, country} = req.body;
        location.city = (Validator.text(city)) ? city.trim() : location.city;
        location.country = (Validator.text(country)) ? country.trim() : location.country;
        LocationModel.findOne({city: new RegExp('^' + escapeRegExp(location.city) + '$', 'i'), country: new RegExp('^' + escapeRegExp(location.country) + '$', 'i')})
            .then(testedLocation => {
                if (!testedLocation){
                    location.save().then(location => res.json(transform(location)), next);
                } else {
                    res.status(400);
                    res.json({
                        error: 'Location already exists',
                        details: transform(testedLocation)});
                    res.end();
                }
            });
    })
});

router.delete('/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(200);
        res.end();
        return next();
    }
    LocationModel.findById(req.params.id)
        .then(location => {
                if (location){
                    TripModel.find({
                        'route.locations': {$in: [req.params.id]}
                    })
                        .then(trips => {
                            if(trips.length > 0) {
                                res.status(400);
                                res.json({
                                    error: "Location is used in Trip",
                                    details: trips.map(transform)
                                });
                                res.end();
                            } else {
                                location.remove();
                                res.json(transform(location));
                            }
                        });

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
