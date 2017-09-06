const express = require('express');
const path = require('path');
const fs = require('fs');
const DBSource = require('./database');

const customers = {
    getAll: () => DBSource.getAll('customers'),
    getById: (id) => DBSource.getAll('customers').then((data) => data.find(customer => customer.id === id))

};

module.exports = customers;