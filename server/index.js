const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Tourist\'s agency'
    });
});

app.get('/customers', (req, res) => {
    res.render('index', {
        title: 'Customers'
    });
});

app.get('/locations', (req, res) => {
    res.render('index', {
        title: 'Locations'
    });
});

app.get('/trips', (req, res) => {
    res.render('index', {
        title: 'Trips'
    });
});

app.listen(3000, () => {
    console.log('Server works on port 3000.');
});