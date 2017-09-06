const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./api/router');

const app = express();
app.locals.errorMessage = null;
app.locals.title = 'Tourist\'s agency';
app.use(express.static(path.join(__dirname,'static')));
app.use(router);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(3000, () => {
    console.log('Server works on port 3000.');
});