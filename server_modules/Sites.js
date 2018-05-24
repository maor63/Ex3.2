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
    if(!req.body.userName|| !req.body.siteID||!req.body.review||!req.body.date) {
        res.send({ message: "bad values" })
    }
    else {
        let userName = req.body.userName;
        let siteID = req.body.siteID;
        let review = req.body.review;
        let date = req.body.date;
        let dbAnswer = db.postReview(siteID, review, date, userName);
        if (dbAnswer) {
            //return password
            res.send({success: false, message: 'Authentication succeeded'});//add password
        }
        else {
            //return message answer is incorrect
            res.send({success: false, message: 'Authentication failed. Answer is incorrect'});
        }
    }
});


exports.postReview=function(siteID, review, date, userName){
    let query = "INSERT INTO Reviews VALUES(DEFAULT,@siteID, @review, @date,@userName);";
    let dbRequest = createRequest(query);
    dbRequest.addParameter('siteID', TYPES.Int,siteID);
    dbRequest.addParameter('review', TYPES.NVarChar, review);
    dbRequest.addParameter('lastName', TYPES.DateTimeFormat,date);
    dbRequest.addParameter('userName', TYPES.NVarChar,userName);
    exports.execQuery(dbRequest);
};