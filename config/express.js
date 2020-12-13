const express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    flash = require('connect-flash'),
    expressValidator = require('express-validator'),
    _ = require('lodash'),
    mongoStore = require('connect-mongo')(session),
    http = require('http'),
    chalk = require('chalk'),
    moment = require('moment'),
    winston = require('winston');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        return {
            param: param,
            message: msg,
            value: value
        };
    }
}));

require('./config')(function (err) {
    if (err) {
        winston.error(err);
    }
    else {
        /**
         * Normalize a port into a number, string, or false.
         */
        function normalizePort(val) {
            var port = parseInt(val, 10);
            if (isNaN(port)) {
                // named pipe
                return val;
            }
            if (port >= 0) {
                // port number
                return port;
            }
            return false;
        }
        /**
         * Event listener for HTTP server "error" event.
         */
        function onError(error) {
            if (error.syscall !== 'listen') {
                throw error;
            }
            var bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;
            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }
        /**
         * Event listener for HTTP server "listening" event.
         */
        function onListening() {
            var addr = server.address();
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            console.log(chalk.bold.green('Server is listening on', bind));
        }
        /**
         * Create HTTP server.
         */
        var server = http.createServer(app);
        /**
         * Get port from environment and store in Express.
         */
        var port = normalizePort(config.host.port || '3000');
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);

        //CORS middleware
        const allowCrossDomain = function (req, res, next) {
            var origin = "*";
            var allowedOrigins = ['http://localhost','http://localhost:4200'];
            origin = req.headers.origin;
            if (allowedOrigins.indexOf(origin) > -1) {
                origin = req.headers.origin
            }
            else {
                origin = '*';
            }
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Credentials', true);
            next();
        };
        app.use(allowCrossDomain);
        app.use((req, res, next) => {
            if (req.method === 'OPTIONS') {
                console.log('!OPTIONS');
                var headers = {};
                // IE8 does not allow domains to be specified, just the *
                // headers["Access-Control-Allow-Origin"] = req.headers.origin;
                headers["Access-Control-Allow-Origin"] = "http://localhost:4200";
                headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
                headers["Access-Control-Allow-Credentials"] = true;
                // headers["Access-Control-Max-Age"] = '86400'; // 24 hours
                headers["Access-Control-Allow-Headers"] = "Content-Type";
                res.writeHead(200, headers);
                res.end();
            } else {
                return next();
            }
        });
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, '../public')));
        app.use(session({
            secret: config.session.secret,
            store: new mongoStore(
                {url: config.mongodb.host + config.mongodb.db_name, ttl: 14 * 24 * 60 * 60, clear_interval: 3600}
            ),
            resave: true,
            saveUninitialized: true,
            cookie: {
                maxAge: 100 * 24 * 3600 * 1000,
                httpOnly: true,
            }
        }));
        app.use(flash());
        var passport = require('./passport');
        app.use(passport.initialize());
        app.use(passport.session());
        const errors = require('./errors');
        require('./routes')(app);
        app.get('/api/*', function (req, res, next) {
            res.status(404);
            res.json({
                success: 0,
                message:"" ,
                response: 304,
                data: {}
            });
        });
        app.get('/*', function (req, res, next) {
            res.render('index');
        });
        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
        // error handlers
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            winston.error(err);
            if (err.message && typeof err.message === "number") {
                err.msgCode = err.message;
            }
            if (err.name == "ValidationError") {
                res.json({
                    success: 0,
                    message: err.errors,
                    response: 304,
                    data: {}
                });
            }
            else {
                if (err.msgCode == '0003') {
                    res.status(401);
                }
                if (err.msgCode == '0004') {
                    res.status(403);
                }
                if (err.status == 404) {
                    res.json({
                        success: 0,
                        message: "Not Found.",
                        response: 304,
                        data: {}
                    });
                }
                else {
                    if (!err.msgCode) {
                        res.json({
                            success: 0,
                            message: "Something went wrong. Please try again.",
                            response: 304,
                            data: {}
                        });
                    }
                    else {
                        res.status(200);
                        res.json({
                            success: 0,
                            message: errors[err.msgCode].msg.EN,
                            response: 304,
                            data: {}
                        });
                    }
                }
            }
        });
    }
});

module.exports = app;
