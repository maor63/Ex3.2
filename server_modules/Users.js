var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens


id = 1;
Users = [];

const superSecret = "SUMsumOpen"; // secret variable



router.post('/signup', function (req, res) {

    let user =
        {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "city": req.body.city,
            "country": req.body.country,
            "email": req.body.email,
            "categories": req.body.categories,
            "verificationQuestions": req.body.verificationQuestions
        };
    Users[id] = user;
    id++;
    
    res.sendStatus(200);


});

router.post('/login', function (req, res) {

    if (!req.body.userName || !req.body.password)
        res.send({ message: "bad values" });

    else {

        for (id in Users) {
            let user = Users[id];

            if (req.body.userName === user.userName)
                if (req.body.password === user.password)
                    sendToken(user, res);
                else {
                    res.send({ success: false, message: 'Authentication failed. Wrong Password' });
                    return
                }

        }

        res.send({ success: false, message: 'Authentication failed. No such user name' })
    }

});

function sendToken(user, res) {
    let payload = {
        userName: user.userName,
        admin: user.isAdmin
    };

    let token = jwt.sign(payload, superSecret, {
        expiresIn: "1d" // expires in 24 hours
    });

    // return the information including token as JSON
    res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
    });

}



module.exports = router;