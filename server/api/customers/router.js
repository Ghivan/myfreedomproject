const express = require('express');
const path = require('path');

const router = express.Router();
const rootDir = path.dirname(require.main.filename);

module.exports = router;
