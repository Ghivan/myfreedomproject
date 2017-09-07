const express = require('express');
const path = require('path');
const fs = require('fs');
const DBSource = require('./database');

const customers = {
    getAll: () => DBSource.getAll('customers'),
    getById: (id) => DBSource.getAll('customers')
        .then((data) =>
            data.find(customer => customer.id === id)
        ),
    add: (data) => DBSource.write('customers', data),
    setTripsNames: (customers, trips) => {
        if (Array.isArray(customers)){
            return customers.map(customer => {
                customer.trips = customer.trips.map(trip => {
                    trip = trips.find(unit => trip === unit.id);
                    return trip.name;
                });

            }).join(', ');
        }  else {
            customers.trips = customers.trips.map(trip => {
                trip = trips.find(unit => trip === unit.id);
                return trip.name;
            }).join(', ');
        }
    }

};

module.exports = customers;