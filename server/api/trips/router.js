const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = path.dirname(require.main.filename);
const tripsDB = require(path.join(rootDir, 'database', 'tripsDB'));
const locationsDB = require(path.join(rootDir, 'database', 'locationsDB'));

router.get('/', (req, res)=> {
    res.locals.title = 'Trips';
    tripsDB.getAll().then(trips => {
        locationsDB.getAll().then(locations => {
            trips.map(trip =>
                trip.route.locations = trip.route.locations.map(id =>{
                        let location = locations.find(location => location.id === id);
                        return location.city + ' (' + location.country + ')'
                    }
                ).join(', '));
            res.locals.trips = trips;
            res.render('trips');
        });
    });
});

router.get('/:id', (req, res)=> {
    tripsDB.getById(parseInt(req.params.id))
        .then(data => console.log(data));
    res.send('ok');
});
module.exports = router;