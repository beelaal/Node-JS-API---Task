const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
    responseModule = require('../../../config/response');
  
let logInAccount = (req, res, next) => {
    if (req.body.userId){
        req.body.userId = req.body.userId.toLowerCase();
    }
        passport.authenticate('local', (err, acct, info) => {
            if (err) {
                return next(err);
            }
            if (!acct) {
                return next(info);
            }
            req.logIn(acct, (err) => {
                if (err) {
                    return next(err);
                }
                responseModule.successResponse(res, {
                    success: 1,
                    message: "User logged in successfully.",
                    data: acct
                });
            });
        })(req, res, next);
    }
   let signup =  (req, res, next)=> {
                req.body.email = req.body.email? req.body.email.toLowerCase(): '';
                User.findOne({$or: [{email: req.body.email}, {mobileNo: req.body.mobileNo}]}).then(existingAcct => {
                    if (existingAcct) {
                        throw {msgCode: 5011};
                    } else { 
                    let account = {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        mobileNo: req.body.mobileNo,
                        status: 0,
                        addressLocation: {
                            [req.body.addressType]: req.body.addressName
                        },
                        addressCoordinates: {
                            [req.body.addressType]: {
                                coordinates: req.body.latLong
                            }
                        }
                    };
                    const userSave = new User(account);
                    return userSave.save();
                    }
                }).then(storeCreated => {
                    let resultObject = {
                        success: 1,
                        message: "",
                        data: ""
                    }
                    resultObject.message = "User created successfully.";
                    resultObject.data = storeCreated;
            
                    responseModule.successResponse(res, resultObject);
                }).catch(err => {
                    return next(err);
                });  
    }
module.exports = {
    signup,
    logInAccount

  
};

