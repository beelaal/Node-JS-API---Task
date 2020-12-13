var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , mongoose = require('mongoose')
    , User = mongoose.model('User')
    , _ = require('lodash');


passport.use(new LocalStrategy({

        usernameField: 'userId',
        passwordField: 'password'

    }, function (username, password, done) {
        User.findOne({$or: [{mobileNo: username}, {email: username}]}, (err, acct) => {

            if (err) {
                return done(err);
            }
            if (!acct) {
                return done(null, false, {msgCode: 5008});
            }

            acct.comparePassword(password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }
                if (!isMatch) {
                    return done(null, false,  {msgCode: 5010});
                }
                return done(null, acct);
            });
        });
    }
));

passport.serializeUser((acct, done) => {
    done(null, acct._id);
});

passport.deserializeUser((_id, done) => {
    User.findById(_id, function (err, acct) {
        done(err, {
                _id: acct._id,
                name : acct.name,
                email: acct.email,
                mobileNo: acct.mobileNo,
                status: acct.status,
                isNumberVerified: acct.isNumberVerified,
                userType : acct.userType || "USER"
            }
        );
    });
});

// passport middlewares
passport.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401);
    return next({msgCode:5043});
};

passport.isAuthorized = (userType) => {
    return (req, res, next) => {
        if (req.user.userType == userType) {
            return next();
        }
        res.status(403);
        return next({msgCode:5043});
    };
};

module.exports = passport;
