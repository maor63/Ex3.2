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
    let user =
        {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "city": req.body.city,
            "country": req.body.country,
            "email": req.body.email,
            "categories": req.body.categories,
            //------------------------------------>
            "verificationQuestions": req.body.verificationQuestions,
            // yael added need to receive array of answer that match the array of questions id
            //---------------------------------------.
            "userName": userName,
            "password": password
        };

    db.addUser(user);
    //need to be change to categories
    db.addCategoriesPerUser(userName, [1, 2, 3]);
    //------------------------------------>
    // db.addAnswersForVerification(userName, [1, 2, 3]);// yael added need to check the parameters to send
    //------------------------------------.
    res.send({
        "userName": userName,
        "password": password
    });

});

router.post('/login', function (req, res) {

    if (!req.body.userName || !req.body.password)
        res.send({message: "bad values"});
    else {
        let password = req.body.password;
        let user = getUser(req.body.userName);
        user.then(function (userObj) {
            if (userObj) {
                if (password === userObj.password) {
                    sendToken(userObj, res);
                }
                else {
                    res.send({success: false, message: 'Authentication failed. No such user name'});
                }
            }
            else
                res.send({success: false, message: 'Authentication failed. No such user name'});
        }).catch(function (err) {
            console.log(err);
            res.send({success: false, message: 'Authentication failed. No such user name'});
        });
    }
});
//-------------------------------------------------------------------------------------->
router.get('/restore', function (req, res) {
    let userName = req.body.userName;
    let question_id = req.body.question_id;// not sure if return all question or by ID
    let dbAnswer = db.getQuestion(userName);
//need to complete

});
router.post('/restore', function (req, res) {//maybe need to change here the restore in the green part
    let userName = req.body.userName;
    let question_id = req.body.question_id;
    let recoveryAnswer = req.body.recoveryAnswer;
    let dbAnswer = db.getAnswer(userName, question_id, recoveryAnswer);
    if (dbAnswer) {
        //return password
        res.send({success: false, message: 'Authentication succeeded'});//add password
    }
    else {
        //return message answer is incorrect
        res.send({success: false, message: 'Authentication failed. Answer is incorrect'});
    }

});


//-----------------------------------------------------------------------------------.

function getUser(userName) {
    let answer = db.getUser(userName);
    return new Promise(function (resolve, reject) {
        answer.then(function (answers) {
            if (answers.length !== 0)
                resolve(answers[0]);
            else
                resolve(undefined);
        }).catch(function (err) {
            console.log(err);
            reject(err);
        });
    });
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

//----------------------------------------Suppose it's Sites.js---------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
module.exports = router;