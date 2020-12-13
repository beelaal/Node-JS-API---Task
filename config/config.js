let glob = require('glob'),
    path = require('path'),
    env = process.env.NODE_ENV || 'development',
    mongoose = require('mongoose'),
    async = require('async'),
    _ = require('lodash'),
    winston = require('winston'),
    fs = require('fs'),
    autoIncrement = require('mongoose-auto-increment');

// set enviornment in global
global.config = {
    env : process.env.NODE_ENV
};

module.exports = function (callback) {

    async.series([
        function (envCb) {
            // configuring the environment
            glob("config/env/**/*.json", function (err, files) {
                if (err) {
                    return envCb(err);
                }
                else {
                    // picking up the environment file
                    config = require(path.join(__dirname, 'env', env + '.json'));
                    _.extend(config, JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8')));
                    if (!config) {
                        return envCb('error occured while loading config file!');
                    }
                    else {
                        winston.info('loaded config file:', env);
                        var dbURI = config.mongodb.host + config.mongodb.db_name;
                        //make connection with mongodb
                        if (!mongoose.connection.readyState) {
                            mongoose.Promise = global.Promise;
                            const options = {
                                useMongoClient: true,
                                autoIndex: false, // Don't build indexes
                                reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
                                reconnectInterval: 500, // Reconnect every 500ms
                                poolSize: 10, // Maintain up to 10 socket connections
                                // If not connected, return errors immediately rather than waiting for reconnect
                                bufferMaxEntries: 0
                              };
                            let connection = mongoose.connect(dbURI, options);
                            autoIncrement.initialize(connection);
                        }
                        else
                            return envCb();
                        // when successfully connected
                        mongoose.connection.on('connected', function () {
                            winston.info('mongoose connection open to ' + dbURI);
                            return envCb();
                        });
                        // if the connection throws an error
                        mongoose.connection.on('error', function (err) {
                            return envCb(err);
                        });
                        // when the connection is disconnected
                        mongoose.connection.on('disconnected', function () {
                            return envCb('mongoose connection disconnected');
                        });
                    }
                }
            });

        },
        function (modelsCb) {
            // load all models
            glob("modules/**/*.model.js", function (err, files) {
                if (err) {
                    return modelsCb(err);
                }
                else {
                    winston.info('models are loading ...');
                    files.forEach(function (file) {
                        require(path.join(__dirname, '../', file));
                        winston.info(file, 'is loaded');
                    });
                    return modelsCb();
                }
            });
        }], function (err) {
        if (err) {
            return callback(err);
        }
        else {
            return callback();
        }
    });

};
