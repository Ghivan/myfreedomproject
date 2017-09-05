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

router.get('/:id', (req, res)=> {
    locationsDB.getById(parseInt(req.params.id))
        .then(data => console.log(data));
    res.send('ok');
});

module.exports = router;