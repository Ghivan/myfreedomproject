const express = require('express');
const path = require('path');
const app = express();
const router = require('./api/router');


app.use(express.static(path.join(__dirname,'static')));
app.use(router);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(3000, () => {
    console.log('Server works on port 3000.');
});