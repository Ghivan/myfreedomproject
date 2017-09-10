const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = path.dirname(require.main.filename);
const locationsDB = require(path.join(rootDir, 'database', 'locationsDB'));
const tripsDB = require(path.join(rootDir, 'database', 'tripsDB'));

router.get('/', (req, res)=> {
    res.locals.title = 'Locations';
    locationsDB.getAll().then(data => {
        res.locals.locations = data;
        res.render('locations');
    });
});

router.post('/add', (req, res) => {
    res.locals.title = 'Locations';
    let city = req.body.city.trim(),
        country = req.body.country.trim();
    locationsDB.getAll().then(locations => {
        res.locals.locations = locations;
        if (!req.body.city || !req.body.country){
            res.locals.errorMessage = 'Данные не переданы';
            res.render('locations');
            return;
        }
        let locationExists = locations.findIndex(
            location => location.city.toLowerCase() === city.toLowerCase() && location.country.toLowerCase() === country.toLowerCase()
        ) !== -1;

        if (locationExists){
            res.locals.errorMessage = 'Локация уже есть в базе данных!';
            res.render('locations');
            return;
        }

        const maxId = Math.max.apply(null, locations.map(location => location.id));
        const id = maxId + 1;
        locations.push({
           id: id,
           city: city,
           country: country
        });
        locationsDB.add(JSON.stringify(locations)).then(() => res.render('locations'))
            .catch(()=> res.render('locations', {errorMessage: 'Ошибка записи в базу!'}));
    })
});

router.get('/delete/:id', (req, res) => {
    res.locals.title = 'Trips';
    locationsDB.getAll().then(locations => {
        let locationId = parseInt(req.params.id);
        let locationIndex = locations.findIndex(location => location.id === locationId);
        if (locationIndex !== -1){
            tripsDB.getAll().then(trips => {
                let locationDeleteIsRestricted =
                    (trips.findIndex(trip =>
                            trip.route.locations.findIndex(rLocation => (rLocation === locationId)) !== -1)
                    ) !== -1;
                if (!locationDeleteIsRestricted){
                    locations.splice(locationIndex, 1);
                    locationsDB.add(JSON.stringify(locations)).then(() => {
                        res.redirect('/locations');
                    });
                } else {
                    res.redirect('/locations');
                }
            })
        } else {
            res.redirect('/trips');
        }

    })
});


module.exports = router;