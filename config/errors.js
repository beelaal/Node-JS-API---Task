const glob = require('glob');
const path = require('path');
const _ = require('lodash');
const fs = require('fs'),
    winston = require('winston');

winston.info('error messages are loading ...');
let routePath = 'modules/**/*.errors.json';
//initialising with common error message objects
let errorObject = {
    "0001": {
        "msg": {
            "EN": "User does not exist."
        }
    },
    "0002": {
        "msg": {
            "EN": "Incorrect password."
        }
    },
    "0003": {
        "msg": {
            "EN": "User is not authenticated."
        }
    },
    "0004": {
        "msg": {
            "EN": "User is not authorized to visit the api."
        }
    }
};

glob.sync(routePath).forEach(function (file) {
    _.extend(errorObject, JSON.parse(fs.readFileSync(file, 'utf-8')));
    winston.info(file + ' is loaded');
});

module.exports = errorObject;
