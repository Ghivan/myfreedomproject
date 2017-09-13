const express = require('express');
const path = require('path');

const router = express.Router();
const rootDir = path.dirname(require.main.filename);
const {LocationModel, transform} = require(path.join(rootDir, 'model', 'database'));
const Validator = require(path.join(rootDir, 'model', 'validators'));

router.get('/', (req, res, next) => {
    LocationModel.find().then(locations => res.json(locations.map(transform)), next)
});

router.get('/:id', (req, res, next) => {
    LocationModel.findById(req.params.id).then(location => res.json(transform(location)), next)
});

router.post('/', (req, res, next) => {
    const {city, country} = req.body;
    LocationModel.findOne({city: new RegExp(city, 'i'), country: new RegExp(country, 'i')}).then(location => {
        if (!location){
            const errors = {
                CITY_IS_EMPTY: !Validator.text(city),
                COUNTRY_IS_EMPTY: !Validator.text(country)
            };

            if (errors.CITY_IS_EMPTY || errors.COUNTRY_IS_EMPTY){
                res.status(400);
                res.json(errors);
                res.end();
            }

            const NewLocation = new LocationModel({
                    city,
                    country
                }
            );
            NewLocation.save().then(location => res.json(transform(location)), next);
        } else {
            res.status(200);
            res.json(transform(location));
            res.end();
        }

    });
});

router.put('/:id', (req, res, next) => {
    LocationModel.findById(req.params.id).then(location => {
        if (!location) {
            res.status(404);
            res.end();
            return next(new Error('Location not found'));
        }

        const {city, country} = req.body;
        location.city = (Validator.text(city)) ? city.trim() : location.city;
        location.country = (Validator.text(country)) ? country.trim() : location.country;
        location.save().then(location => res.json(transform(location)), next);
    })
});

router.delete('/:id', (req, res, next) => {
    LocationModel.findById(req.params.id)
        .then(location => {
                if (location){
                    location.remove();
                    res.json(location);
                } else {
                    res.status(200);
                    res.end();
                }
            }, next
        );
});

router.all((err, req, res, next) => {
    res.status(500);
    res.send(err);
});

module.exports = router;