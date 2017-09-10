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
            res.locals.trips = trips;
            customersDB.setTripsNames(customers, trips);
            res.locals.customers = customers;
            res.render('customers');
        });
    });
});

router.post('/add', (req, res) => {
    res.locals.title = 'Customers';
    let firstName = req.body.firstName.trim();
    let lastName = req.body.lastName.trim();
    if (!req.body.trips) req.body.trips = [];
    if (!Array.isArray(req.body.trips)) req.body.trips =[req.body.trips];
    customersDB.getAll().then(customers => {
        tripsDB.getAll().then(trips => {
            res.locals.trips = trips;
            let repeats = {
                firstName: false,
                lastName: false
            };
            if (customers.find(customer => customer.firstName.toLowerCase() === firstName.toLowerCase())){
                repeats.firstName = true;
            }
            if (customers.find(customer => customer.lastName.toLowerCase() === lastName.toLowerCase())){
                repeats.lastName = true;
            }
            if (repeats.firstName && repeats.lastName){
                res.locals.errorMessage = 'Клиент уже есть в базе данных!';
                customersDB.setTripsNames(customers, trips);
                res.locals.customers = customers;
                res.render('customers');
                return;
            }

            const maxId = Math.max.apply(null, customers.map(customer => customer.id));
            const id = (maxId > 0) ? maxId + 1 : 1;
            customers.push({
                id: id,
                firstName: firstName,
                lastName: lastName,
                trips: req.body.trips.map(trip => parseInt(trip))
            });
            customersDB.add(JSON.stringify(customers)).then(() => {
                res.redirect('/customers');
            });
        })
    })
});

router.get('/manage/:id', (req, res)=> {
    customersDB.getById(parseInt(parseInt(req.params.id)))
        .then(customer => {
            if (!customer){
                res.redirect('/customers');
            }
            tripsDB.getAll()
                .then(trips => {
                    customersDB.setTripsNames(customer, trips);
                    res.locals.customer = customer;
                    res.locals.trips = trips;
                    res.render('customersManage')
                })
        });
});

router.post('/update/:id', (req, res) => {
    res.locals.title = 'Customers';
    let firstName = req.body.firstName.trim();
    let lastName = req.body.lastName.trim();
    if (!req.body.trips) req.body.trips = [];
    if (!Array.isArray(req.body.trips)) req.body.trips =[req.body.trips];
    customersDB.getAll().then(customers => {
        tripsDB.getAll()
            .then(trips => {
                res.locals.trips = trips;
                let customer = customers.find(person => person.id === parseInt(req.params.id));
                if (!customer){
                    res.locals.errorMessage = 'Клиента нет в базе данных!';
                    res.redirect('/customers');
                }
                customer.firstName = firstName;
                customer.lastName = lastName;
                customer.trips = req.body.trips.map(trip => parseInt(trip));
                customersDB.add(JSON.stringify(customers)).then(() => {
                    res.redirect('/customers');
                });
            })
    })
});

router.get('/delete/:id', (req, res)=> {
    let customerId = parseInt(req.params.id);
    res.locals.title = 'Customers';
    customersDB.getAll().then(customers => {
        let customerIndex = customers.findIndex(person => person.id === customerId);
        if (customerIndex !== -1){
            customers.splice(customerIndex, 1);
            customersDB.add(JSON.stringify(customers)).then(() => {
                res.redirect('/customers');
            })
        } else {
            res.redirect('/customers');
        }

    })
});

module.exports = router;