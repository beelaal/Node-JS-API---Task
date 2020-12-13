/**
 * Created by Bilal on 8/4/2017.
 */

const winston = require('winston');

let validateSignUpParams = (req, res, next) => {
    req.assert('name', 5003).notEmpty();
    req.assert('email', 5000).notEmpty();
    req.assert('email', 5001).isEmail();
    req.assert('password', 5002).notEmpty();
    req.assert('mobileNo', 5005).notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        winston.error('User could not be signed up', errors[0]);
        return next(errors[0]);
    }
    return next();
}
let validateLogInParams = (req, res, next) => {
    req.assert('userId', 5006).notEmpty();
    req.assert('password', 5002).notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        winston.error('user could not be logged in', errors[0]);
        return next(errors[0]);
    }

    return next();
}

module.exports = {
    validateSignUpParams,
    validateLogInParams,
}