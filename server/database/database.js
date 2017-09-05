const express = require('express');
const path = require('path');
const fs = require('fs');

const DB = {
    getAll: (source) => new Promise((resolve, reject) =>
        fs.readFile(path.join(__dirname, 'files', source + '.json'), 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        }))
        .then((data)=> JSON.parse(data))
        .catch(() => {
            console.log('Cannot get source!');
        })
};

module.exports = DB;