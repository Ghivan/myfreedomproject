const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = path.dirname(require.main.filename);
const locationsDB = require(path.join(rootDir, 'database', 'locationsDB'));

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
        let repeats = {
            city: false,
            country: false
        };

        if (locations.find(location => location.city.toLowerCase() === city.toLowerCase())){
            repeats.city = true;
        }
        if (locations.find(location => location.country.toLowerCase() === country.toLowerCase())){
            repeats.country = true;
        }
        if (repeats.city && repeats.country){
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

router.get('/:id', (req, res)=> {
    locationsDB.getById(parseInt(req.params.id))
        .then(data => res.json(JSON.stringify(data)));
    res.send('ok');
});


module.exports = router;