const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./api/router');

const app = express();
const PORT = 3001;
app.use(express.static(path.join(__dirname,'static')));
app.use(router);

app.listen(PORT, () => {
    console.log('Server works on port ' + PORT + '.');
});
