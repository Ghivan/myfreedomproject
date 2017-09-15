const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = path.dirname(require.main.filename);
const tripsDB = require(path.join(rootDir, 'database', 'tripsDB'));
const locationsDB = require(path.join(rootDir, 'database', 'locationsDB'));
const customersDB = require(path.join(rootDir, 'database', 'customersDB'));

router.get('/', (req, res)=> {
    res.locals.title = 'Trips';
    tripsDB.getAll().then(trips => {
        locationsDB.getAll().then(locations => {
            res.locals.locations = locations;
            tripsDB.setLocationsNames(trips, locations);
            res.locals.trips = trips;
            res.render('trips');
        });
    });
});

router.post('/add', (req, res) => {
    res.locals.title = 'Trips';
    let name = req.body.name.trim();
    if (!Array.isArray(req.body.locations)) req.body.locations =[req.body.locations];
    tripsDB.getAll().then(trips => {
        res.locals.trips = trips;
        locationsDB.getAll().then(locations => {
            res.locals.locations = locations;
            if (trips.find(trip => trip.name.toLowerCase() === name.toLowerCase())){
                res.locals.errorMessage = 'Маршрут уже есть в базе данных!';
                tripsDB.setLocationsNames(trips, locations);
                res.render('trips');
                return;
            }
            const maxId = Math.max.apply(null, trips.map(trip => trip.id));
            const id = (maxId > 0) ? maxId + 1 : 1;
            trips.push({
                id: id,
                name: name,
                route: {
                    locations: req.body.locations.map(location => parseInt(location)),
                    arrivalDate: req.body.arrivalDate,
                    destinationDate: req.body.destinationDate
                }
            });
            tripsDB.add(trips)
                .then(() => {
                    tripsDB.setLocationsNames(trips, locations);
                    res.render('trips')
                })
                .catch(()=> res.render('locations', {errorMessage: 'Ошибка записи в базу!'}));
        })
    })
});

router.get('/delete/:id', (req, res) => {
    res.locals.title = 'Trips';
    tripsDB.getAll().then(trips => {
        let tripId = parseInt(req.params.id);
        let tripIndex = trips.findIndex(trip => trip.id === tripId);
        if (tripIndex !== -1){
            customersDB.getAll().then(customers => {
                let tripDeleteIsRestricted =
                    (customers.findIndex(customer =>
                            customer.trips.findIndex(cTrip => (cTrip === tripId)) !== -1)
                    ) !== -1;
                if (!tripDeleteIsRestricted){
                    trips.splice(tripIndex, 1);
                    tripsDB.add(trips).then(() => {
                        res.redirect('/trips');
                    });
                } else {
                    res.redirect('/trips');
                }
            })
        } else {
            res.redirect('/trips');
        }

    })
});

module.exports = router;