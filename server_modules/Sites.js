var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var db = require("../DButils");
var crypto = require("crypto");
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;


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

router.get('/all', function (req, res) {// this function return all of the sites - OVED
    let dbAnswer = db.getAllSites();
    dbAnswer.then(function (sites) {
        res.send(sites);
    }).catch(function (err) {
        console.log(err);
        res.end();
    });

});

router.get('/popular', function (req, res) {// this function return all of the sites - OVED
    let dbAnswer = db.getPopularSites();
    dbAnswer.then(function (sites) {
        res.send(sites);
    }).catch(function (err) {
        console.log(err);
        res.end();
    });

});

router.get('/all_by_category_id/:categoryid', function (req, res) {// this function return all of the sites - OVED
    let categoryid = req.params.categoryid;
    let dbAnswer = db.getAllSitesByCategory(categoryid);
    dbAnswer.then(function (sites) {
        res.send(sites);
    }).catch(function (err) {
        console.log(err);
        res.end();
    });

});


router.get('/photo_url/:siteid', function (req, res) {// this function return all of the urls- OVED
    let siteid = req.params.siteid;
    let dbAnswer = db.getAllPhotoUrlBySite(siteid);
    dbAnswer.then(function (urls) {
        res.send(urls);
    }).catch(function (err) {
        console.log(err);
        res.end();
    });

});


router.get('/site_reviews/:siteid', function (req, res) {// this function return all of the reviews -oved
    let siteid = req.params.siteid;
    let dbAnswer = db.getAllReviewsBySite(siteid);
    dbAnswer.then(function (reviews) {
        res.send(reviews);
    }).catch(function (err) {
        console.log(err);
        res.end();
    });

});


module.exports = router;