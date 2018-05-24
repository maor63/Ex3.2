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


router.post('/review', function (req, res) {//maybe need to change here the restore in the green part
    if (!req.body.userName || !req.body.siteID || !req.body.review || !req.body.date) {
        res.send({message: "bad values"})
    }
    else {
        let userName = req.body.userName;
        let siteID = req.body.siteID;
        let review = req.body.review;
        let date = req.body.date;
        let dbAnswer = db.postReview(siteID, review, date, userName);
        res.end();
    }
});

router.delete('/delFavorite', function (req, res) {// delete favorite site for user
    let siteID = req.body.siteID;
    let userName = req.body.userName;
    let dbAnswer = db.deleteFavorite(siteID, userName);

    res.end();


});

router.get('/search/:sitename', function (req, res) {//oved

    let siteName = req.params.sitename;
    let dbAnswer = db.getSearchResult(siteName);
    dbAnswer.then(function (sites) {
       res.send(sites);
    }).catch(function (err) {
        console.log(err);
        res.end();
    });


});

module.exports = router;