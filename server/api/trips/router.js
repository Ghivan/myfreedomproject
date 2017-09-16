const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = path.dirname(require.main.filename);
const tripsDB = require(path.join(rootDir, 'database', 'tripsDB'));
const locationsDB = require(path.join(rootDir, 'database', 'locationsDB'));
const customersDB = require(path.join(rootDir, 'database', 'customersDB'));
const {getNextId} = require(path.join(rootDir, 'database', 'utils'));

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
    let name = req.body.name.trim() || 'Новый маршрут ' + new Date(Date.now()).toLocaleString();
    let requestedLocations = req.body.locations || [];
    if (!Array.isArray(requestedLocations)) requestedLocations =[requestedLocations];

    Promise.all([tripsDB.getAll(), locationsDB.getAll()]).then(([trips, locations]) => {
        if (trips.find(trip => trip.name.toLowerCase() === name.toLowerCase())){
            tripsDB.setLocationsNames(trips, locations);
            res.render('trips', {errorMessage: 'Маршрут уже есть в базе данных!', title: 'Trips', trips, locations});
            return;
        }
        trips.push({
            id: getNextId(trips),
            name: name,
            route: {
                locations: requestedLocations.map(location => parseInt(location)),
                arrivalDate: req.body.arrivalDate,
                destinationDate: req.body.destinationDate
            }
        });
        tripsDB.add(trips)
            .then(() => {
                tripsDB.setLocationsNames(trips, locations);
                res.render('trips', {title: 'Trips', trips, locations})
            })
            .catch(()=> res.render('trips', {errorMessage: 'Ошибка записи в базу!', trips, locations}));
    });
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
