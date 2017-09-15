const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = path.dirname(require.main.filename);
const tripsDB = require(path.join(rootDir, 'database', 'tripsDB'));
const customersDB = require(path.join(rootDir, 'database', 'customersDB'));
const {getNextId} = require(path.join(rootDir, 'database', 'utils'));


router.get('/', (req, res)=> {
    Promise.all([customersDB.getAll(), tripsDB.getAll()]).then(([customers, trips]) => {
        customersDB.setTripsNames(customers, trips);
        res.render('customers', {title: 'Customers', trips, customers});
    })
});

router.post('/add', (req, res) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.firstName.trim() || !req.body.lastName.trim()){
        Promise.all([customersDB.getAll(), tripsDB.getAll()]).then(([customers, trips]) => {
            customersDB.setTripsNames(customers, trips);
            res.render('customers', {title: 'Customers', errorMessage: 'Не введены имя и(или) фамилия клиента', trips, customers});
        });
        return;
    }
    let firstName = req.body.firstName.trim();
    let lastName = req.body.lastName.trim();
    let requestedTrips = req.body.trips || [];
    if (!Array.isArray(requestedTrips)) requestedTrips =[requestedTrips];
    customersDB.getAll().then(customers => {
        tripsDB.getAll().then(trips => {
            customers.push({
                id: getNextId(customers),
                firstName: firstName,
                lastName: lastName,
                trips: requestedTrips.map(trip => parseInt(trip))
            });
            customersDB.add(customers).then(() => {
                res.redirect('/customers');
            });
        })
    })
});

router.get('/manage/:id', (req, res)=> {
    customersDB.getById(parseInt(req.params.id))
        .then(customer => {
            if (!customer){
                Promise.all([customersDB.getAll(), tripsDB.getAll()]).then(([customers, trips]) => {
                    customersDB.setTripsNames(customers, trips);
                    res.render('customers', {title: 'Customers', errorMessage: 'Клиента с идентификационным номером ' + req.params.id +' не существует!', trips, customers});
                });
                return;
            }
            tripsDB.getAll()
                .then(trips => {
                   customersDB.setTripsNames(customer, trips);
                    res.render('customersManage', {title: 'Customers', trips, customer})
                })
        });
});

router.post('/update/:id', (req, res) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.firstName.trim() || !req.body.lastName.trim()){
        Promise.all([customersDB.getAll(), tripsDB.getAll()]).then(([customers, trips]) => {
            customersDB.setTripsNames(customers, trips);
            res.render('customers', {title: 'Customers', trips, customers});
        });
        return;
    }
    let firstName = req.body.firstName.trim();
    let lastName = req.body.lastName.trim();
    let requestedTrips = req.body.trips || [];
    if (!Array.isArray(requestedTrips)) requestedTrips =[requestedTrips];

    Promise.all([customersDB.getAll(), tripsDB.getAll()]).then(([customers, trips]) => {
        res.locals.trips = trips;
        let customer = customers.find(person => person.id === parseInt(req.params.id));
        if (!customer){
            res.locals.errorMessage = 'Клиента нет в базе данных!';
            res.redirect('/customers');
        }
        customer.firstName = firstName;
        customer.lastName = lastName;
        customer.trips = requestedTrips.map(trip => parseInt(trip));
        customersDB.add(customers).then(() => {
            res.redirect('/customers');
        });
    });
});

router.get('/delete/:id', (req, res)=> {
    let customerId = parseInt(req.params.id);
    res.locals.title = 'Customers';
    customersDB.getAll().then(customers => {
        let customerIndex = customers.findIndex(person => person.id === customerId);
        if (customerIndex !== -1){
            customers.splice(customerIndex, 1);
            customersDB.add(customers).then(() => {
                res.redirect('/customers');
            })
        } else {
            res.redirect('/customers');
        }

    })
});

module.exports = router;