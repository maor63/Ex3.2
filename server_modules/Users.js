var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var db = require("../DButils");
var crypto = require("crypto");
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;


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
            "verificationQuestions": req.body.verificationQuestions,
            "verificationAnswers": req.body.verificationAnswers,
            "userName": userName,
            "password": password
        };

    db.addUser(user).then(function (ans) {
        //need to be change to categories
        //TODO Change the input array of categories
        db.addCategoriesPerUser(userName, req.body.categories);
        //------------------------------------>
        let questionsWithAnswers = [];
        for (let i = 0; i < req.body.verificationQuestions.length; i++) {
            questionsWithAnswers[i] = {};
            questionsWithAnswers[i].question_id = req.body.verificationQuestions[i];
            questionsWithAnswers[i].answer = req.body.verificationAnswers[i];
        }
        db.addAnswersForVerification(userName, questionsWithAnswers);// yael added need to check the parameters to send
        //------------------------------------.
        res.send({
            "userName": userName,
            "password": password
        });

    }).catch(function (err) {
        console.log(err);
        res.send({message: "Something went wrong please try again"});
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
router.get('/verification_questions/:userName', function (req, res) {
    let userName = req.params.userName;
    let question_id = req.body.question_id;// not sure if return all question or by ID
    db.getQuestions(userName).then(function (questions) {
        res.send(questions);
    });
});

router.post('/restore', function (req, res) {//maybe need to change here the restore in the green part
    let userName = req.body.userName;
    let question_id = req.body.question_id;
    let answer = req.body.answer;
    db.verifyAnswer(userName, question_id, answer).then(function (answers) {
        if (answers.length === 1)
            res.send({success: true, message: 'Authentication succeeded', "password": answers[0]});//add password
        else
            res.send({success: false, message: 'Authentication failed'});//add password

    }).catch(function (err) {
        console.log(err);
    });
});

router.get('/categories/:username', function (req, res) {//maybe need to change here the restore in the green part
    let userName = req.params.username;
    let dbAnswer = db.getAllCategoriesByUser(userName);
    dbAnswer.then(function (categories) {
        res.send(categories);
    }).catch(function (err) {
        console.log(err);
        res.end();
    });

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