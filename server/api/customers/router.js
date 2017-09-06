const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = path.dirname(require.main.filename);
const tripsDB = require(path.join(rootDir, 'database', 'tripsDB'));
const customersDB = require(path.join(rootDir, 'database', 'customersDB'));


router.get('/', (req, res)=> {
    res.locals.title = 'Customers';
    customersDB.getAll().then(customers => {
        tripsDB.getAll().then(trips => {
            customers.map(customer => {
                customer.trips = customer.trips.map(trip => {
                    trip = trips.find(unit => trip === unit.id);
                    return trip.name;
                });

            }).join(', ');
            res.locals.customers = customers;
            res.render('customers');
        });
    });
});

router.get('/:id', (req, res)=> {
    customersDB.getById(parseInt(req.params.id))
        .then(data => console.log(data));
    res.send('ok');
});

module.exports = router;