const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = path.dirname(require.main.filename);
const locationsDB = require(path.join(rootDir, 'database', 'locationsDB'));
const tripsDB = require(path.join(rootDir, 'database', 'tripsDB'));
const {getNextId} = require(path.join(rootDir, 'database', 'utils'));

router.get('/', (req, res)=> {
    locationsDB.getAll().then(locations => {
        res.render('locations', {title: 'Locations', locations});
    });
});

router.post('/add', (req, res) => {
    if (!req.body.city || !req.body.city.trim() || !req.body.country || !req.body.country.trim()){
        locationsDB.getAll().then(locations => {
            res.render('locations', {title: 'Locations', locations, errorMessage: 'Название страны и(или) города не были переданы'});
        });
        return;
    }

    let city = req.body.city.trim();
    let country = req.body.country.trim();

    locationsDB.getAll().then(locations => {
        let locationExists = locations.find(
            location => location.city.toLowerCase() === city.toLowerCase() && location.country.toLowerCase() === country.toLowerCase()
        );

        if (locationExists){
            res.render('locations', {title: 'Locations', locations, errorMessage: 'Локация уже есть в базе данных!'});
            return;
        }

        locations.push({
            id: getNextId(locations),
            city: city,
            country: country
        });
        locationsDB.add(locations)
            .then(() => res.render('locations', {title: 'Locations', locations}))
            .catch(()=> res.render('locations', {locations, errorMessage: 'Ошибка записи в базу!'}));
    })
});

router.get('/delete/:id', (req, res) => {
    locationsDB.getAll().then(locations => {
        let locationId = parseInt(req.params.id);
        let locationIndex = locations.findIndex(location => location.id === locationId);
        if (locationIndex !== -1){
            tripsDB.getAll().then(trips => {
                let locationDeleteIsRestricted = trips.find(trip =>
                            trip.route.locations.find(rLocation => (rLocation === locationId)));
                if (!locationDeleteIsRestricted){
                    locations.splice(locationIndex, 1);
                    locationsDB.add(locations).then(() => {
                        res.redirect('/locations');
                    });
                } else {
                    locationsDB.getAll().then(locations => {
                        res.render('locations', {title: 'Locations', locations, errorMessage: 'Локация используется в путешествиях!'});
                    });
                }
            })
        } else {
            res.redirect('/locations');
        }

    })
});


module.exports = router;
