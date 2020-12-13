const userController = require('../controller/user.controller'),
    passport = require('../../../config/passport'),
    userMiddleware = require('../middleware/user.middleware');
module.exports = function (app, version) {
    app.post(version + '/user/signUp', userMiddleware.validateSignUpParams, userController.signup);
     app.post(version + '/user/logIn', userMiddleware.validateLogInParams, userController.logInAccount);
    // app.post(version + '/user/editProfile', passport.isAuthenticated, userController.editProfile);
   

};