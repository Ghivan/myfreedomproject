const moment = require('moment');

module.exports = (value) => {
     return moment(value, 'YYYY-MM-DD', true).isValid()
};