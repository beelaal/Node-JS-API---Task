'use strict';

let mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    bcrypt = require('bcryptjs'),
    winston = require('winston');

const Schema = mongoose.Schema,
    addressObject = {
        address: {type: String},
        location: {
            type: {type: String},
            coordinates: [Number]
        },
        alias: {type: String, enum: ["HOME", "WORK", "OTHER"]},
        isSelected: {type: Boolean, default: false}
    }

var UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    mobileNo: {type: String, required: true},
    address: [addressObject],
    status: {type: Number, default: 0}, 
    profileImage: {type: String, default: ""},
    userType: {type: String, required: true, enum: ['USER', 'ADMIN'], default: 'USER'}
});
UserSchema.plugin(timestamps);
UserSchema.index({email: 1}, {background: true, name: 'IDX_USER_EMAIL'});
UserSchema.index({'address.location': '2dsphere'});
UserSchema.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });

});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const userObject = mongoose.model('User', UserSchema);
userObject.findOne({userType: 'ADMIN'}).then(userFound => {
    if (!userFound) {
        let createUserObject = {
            name: 'Super Admin',
            email: 'admin@test.com',
            password: 'superAdmin',
            userType: 'ADMIN',
            mobileNo : '23211233424',
            status : 1
        }
        return new userObject(createUserObject).save().then(userCreated => {
            winston.info("Account created.");
        }).catch(err => {
            winston.error(err);
        });
    }
    else{
        winston.info("Account already created.");
    }

});


module.exports = userObject;