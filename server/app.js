const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./api/router');

const app = express();
app.use(router);
app.use(express.static(path.join(__dirname,'static')));
module.exports = app;