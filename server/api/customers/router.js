const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');

const router = express.Router();
const {TripModel, CustomerModel, transform} = require('../../model/database');
const Validator = require('../../model/validators');


router.get('/', (req, res, next) => {
    Promise.all([TripModel.find(), CustomerModel.find()]).then(([trips, customers]) => {
        const normalizedTrips =_.keyBy(trips.map(transform), trip => trip.id);
        customers.forEach(customer => {
            customer.trips = customer.trips.map(tripId => normalizedTrips[tripId]);
        });
        res.json(customers.map(transform));
    }, next)
});

router.get('/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(404);
        res.end();
        return next();
    }
    CustomerModel.findById(req.params.id).then(customer => {
        if (customer){
            TripModel.find({_id :{ $in: customer.trips }}).then(trips => {
                customer.trips = customer.trips.map(customerTrip =>
                    transform(
                        trips.find(
                            trip => trip._id.toString() === customerTrip.toString()
                        )
                    )
                );
                res.json(transform(customer));
            });
        } else {
            res.status(404);
            res.end();
        }

    }, next)
});

router.post('/', (req, res, next) => {
    let {firstName, lastName} = req.body;
    let requestedTrips = req.body.trips;

    const errors = {
        CUSTOMER_FIRST_NAME_IS_EMPTY: !Validator.text(firstName),
        CUSTOMER_LAST_NAME_IS_EMPTY: !Validator.text(lastName),
        toString: () => {
            let message = '';
            if (this.CUSTOMER_FIRST_NAME_IS_EMPTY) message += ' You should provide first name.';
            if (this.CUSTOMER_LAST_NAME_IS_EMPTY) message += ' You should provide last name.';
            return message;
        }
    };

    if (errors.CUSTOMER_FIRST_NAME_IS_EMPTY || errors.CUSTOMER_LAST_NAME_IS_EMPTY){
        res.statusMessage = errors.toString();
        res.status(400);
        res.end();
        return next();
    }

    const NewCustomer = new CustomerModel({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        trips: requestedTrips
    });

    if (requestedTrips.length > 0){
        TripModel.find({_id :{ $in: requestedTrips }})
            .then(trips => {
                if (trips.length !== requestedTrips.length){
                    res.statusMessage = 'Check trips existence!';
                    res.status(400);
                    res.end();
                    return next();
                }
                res.status(200);
                NewCustomer.save().then(customer => res.json(transform(customer)), next);
            })
            .catch(err => {
                res.status(500);
                res.json({
                    error: err.message
                });
                res.end();
                return next();
            })
    } else {
        res.status(200);
        NewCustomer.save().then(customer => res.json(transform(customer)), next);
    }
});

router.put('/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(404);
        res.end();
        return next();
    }

    let {firstName, lastName} = req.body;
    let requestedTrips = null;
    let errors =[];

    if (firstName){
        if (!Validator.text(firstName)){
            errors.push('Invalid customer\'s first name');
        } else {
            firstName = firstName.trim()
        }
    }

    if (lastName){
        if (!Validator.text(lastName)){
            errors.push('Invalid customer\'s last name');
        } else {
            lastName = lastName.trim()
        }
    }

    if (req.body.trips) {
        requestedTrips = req.body.trips;

        requestedTrips.map(tripId => {
            try{
                tripId = mongoose.Types.ObjectId(tripId)
            } catch (e) {
                errors.push('Invalid trips id');
            }
        });
    }

    if (errors.length > 0){
        res.statusMessage = errors.join(' ');
        res.status(400);
        res.end();
        return next();
    }

    CustomerModel.findById(req.params.id).then(customer => {
        if (firstName) customer.firstName = firstName;
        if (lastName) customer.lastName = lastName;

        if (requestedTrips){
            TripModel.find({_id :{ $in: requestedTrips }}).then(trips => {
                if (trips.length !== requestedTrips.length){
                    res.statusMessage = 'Check trips existence!';
                    res.status(400);
                    res.end();
                    return next();
                }
                customer.trips = requestedTrips;
                res.status(200);
                customer.save().then(customer => res.json(transform(customer)), next);
            })
        } else {
            res.status(200);
            customer.save().then(customer => res.json(transform(customer)), next);
        }
    })

});

router.delete('/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        res.status(404);
        res.end();
        return next();
    }
    CustomerModel.findById(req.params.id)
        .then(customer => {
                if (customer){
                    customer.remove();
                    res.json(transform(customer));
                } else {
                    res.status(200);
                    res.end();
                }
            }, next
        );
});

module.exports = router;
