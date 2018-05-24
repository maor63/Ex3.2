var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var db = require("../DButils");
var crypto = require("crypto");
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;


id = 1;
Users = [];

const superSecret = "SUMsumOpen"; // secret variable


router.post('/signup', function (req, res) {

    let password = crypto.randomBytes(5).toString('hex');
    let userName = makeUserName();
    while (isExists(userName)){
        userName = makeUserName();
    }

    let user =
        {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "city": req.body.city,
            "country": req.body.country,
            "email": req.body.email,
            "categories": req.body.categories,
            "verificationQuestions": req.body.verificationQuestions,
            "userName": userName,
            "password": password
        };

    db.addUser(user);
    // db.addCategoriesPerUser(userName, user.categories);
    res.send({
        "userName": userName,
        "password": password
    });

});

router.post('/login', function (req, res) {

    if (!req.body.userName || !req.body.password)
        res.send({message: "bad values"});

    else {

        for (id in Users) {
            let user = Users[id];

            if (req.body.userName === user.userName)
                if (req.body.password === user.password)
                    sendToken(user, res);
                else {
                    res.send({success: false, message: 'Authentication failed. Wrong Password'});
                    return
                }

        }

        res.send({success: false, message: 'Authentication failed. No such user name'})
    }

});

router.post('/restore', function (req, res) {
    let userName = req.body.userName;
    let question_id = req.body.question_id;
    let recoveryAnswer = req.body.recoveryAnswer;

});


function isExists(userName) {
    for (let i in Users) {
        let user = Users[i];
        if(user.userName === userName){
            return true;
        }
    }
    return false;
}

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

function makeUserName() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}


module.exports = router;