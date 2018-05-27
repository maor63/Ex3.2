// =======================
// get the packages we need ============
// =======================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var Users = require('./server_modules/Users'); // get our users model
var Sites = require('./server_modules/Sites'); // get our sites model
var poi = require('./server_modules/POI')
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080;

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

var  superSecret = "SUMsumOpen"; // secret variable


// =======================
// routes ================
// =======================
// basic route
app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});



// route middleware to verify a token
app.use('/reg', function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, superSecret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                // get the decoded payload and header
                let decoded = jwt.decode(token, {complete: true});
                req.decoded= decoded;
                console.log(decoded.header);
                console.log(decoded.payload);
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }

});



app.use('/reg/poi', poi);
app.use('/users', Users);
app.use('/sites', Sites);



// =======================
// start the server ======
// =======================
app.listen(port, function(){ console.log('Magic happens at http://localhost:' + port); });
