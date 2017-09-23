const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const router = express.Router();
const rootDir = path.dirname(require.main.filename);
const {TripModel, CustomerModel, transform} = require(path.join(rootDir, 'model', 'database'));
const Validator = require(path.join(rootDir, 'model', 'validators'));


router.get('/', (req, res, next) => {
    Promise.all([TripModel.find(), CustomerModel.find()]).then(([trips, customers]) => {
        customers = customers.map(customer => {
            customer.trips = customer.trips.map(customerTrip =>
                transform(trips.find(trip => trip._id.toString() === customerTrip.toString()))
            );
            return transform(customer);
        });
        res.json(customers);
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
    let requestedTrips = req.body.trips || [];
    if (!Array.isArray(requestedTrips)) requestedTrips = [requestedTrips];

    const errors = {
        CUSTOMER_FIRST_NAME_IS_EMPTY: !Validator.text(firstName),
        CUSTOMER_LAST_NAME_IS_EMPTY: !Validator.text(lastName),
    };

    if (errors.CUSTOMER_FIRST_NAME_IS_EMPTY || errors.CUSTOMER_LAST_NAME_IS_EMPTY){
        res.status(400);
        res.json(errors);
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
                    res.status(400);
                    res.json({
                        error: 'Check trips existence!'
                    });
                    res.end();
                    return next();
                }
                res.status(201);
                NewCustomer.save().then(customer => res.json(transform(customer)), next);
            })
            .catch(err => {
                res.status(400);
                res.json({
                    error: 'Invalid trips id'
                });
                res.end();
                return next();
            })
    } else {
        res.status(201);
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
        if (!Array.isArray(req.body.trips)){
            requestedTrips = [req.body.trips];
        } else {
            requestedTrips = req.body.trips;
        }
        requestedTrips.map(tripId => {
            try{
                tripId = mongoose.Types.ObjectId(tripId)
            } catch (e) {
                errors.push('Invalid trips id');
            }
        });
    }

    if (errors.length > 0){
        res.status(400);
        res.json({
            error: errors.concat(' '),
            details: errors
        });
        res.end();
        return next();
    }

    CustomerModel.findById(req.params.id).then(customer => {
        if (firstName) customer.firstName = firstName;
        if (lastName) customer.lastName = lastName;

        if (requestedTrips){
            TripModel.find({_id :{ $in: requestedTrips }}).then(trips => {
                if (trips.length !== requestedTrips.length){
                    res.status(400);
                    res.json({
                        error: 'Check trips existence!'
                    });
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
