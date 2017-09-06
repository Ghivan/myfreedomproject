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
            res.locals.locations = locations;
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
router.post('/add', (req, res) => {
    res.locals.title = 'Roots';
    let name = req.body.name.trim();
    if (!Array.isArray(req.body.locations)) req.body.locations =[req.body.locations];
    tripsDB.getAll().then(trips => {
        res.locals.trips = trips;
        locationsDB.getAll().then(locations => {
            res.locals.locations = locations;
            if (trips.find(trip => trip.name.toLowerCase() === name.toLowerCase())){
                res.locals.errorMessage = 'Маршрут уже есть в базе данных!';
                res.render('trips');
                return;
            }

            const maxId = Math.max.apply(null, trips.map(trip => trip.id));
            const id = maxId + 1;
            trips.push({
                id: id,
                name: name,
                route: {
                    locations: req.body.locations.map(location => parseInt(location)),
                    arrivalDate: req.body.arrivalDate,
                    destinationDate: req.body.destinationDate
                }
            });
            tripsDB.add(JSON.stringify(trips)).then(() => {
                trips.map(trip =>
                    trip.route.locations = trip.route.locations.map(id =>{
                            let location = locations.find(location => location.id === id);
                            return location.city + ' (' + location.country + ')'
                        }
                    ).join(', '));
                res.render('trips')
            })
                .catch(()=> res.render('locations', {errorMessage: 'Ошибка записи в базу!'}));
        })
    })
});
router.get('/:id', (req, res)=> {
    tripsDB.getById(parseInt(req.params.id))
        .then(data => console.log(data));
    res.send('ok');
});
module.exports = router;