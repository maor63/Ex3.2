var express = require('express');
var router = express.Router();
var db = require("../DButils");


router.get('/search/:sitename', function (req, res) {//this function return a site by search of a name.

    let siteName = req.params.sitename;
    let dbAnswer = db.getSearchResult(siteName);
    dbAnswer.then(function (sites) {
        res.send(sites);
    }).catch(function (err) {
        console.log(err);
        res.send({message: "bad values"})
    });

});

router.get('/all', function (req, res) {// this function return all of the sites
    let dbAnswer = db.getAllSites();
    dbAnswer.then(function (sites) {
        res.send(sites);
    }).catch(function (err) {
        console.log(err);
        res.end();
    });

});

router.get('/popular', function (req, res) {// this function return all of the sites that their rank is more then 3
    let dbAnswer = db.getPopularSites();
    dbAnswer.then(function (sites) {
        res.send(sites);
    }).catch(function (err) {
        console.log(err);
        res.end();
    });

});

router.get('/all_by_category_id/:categoryid', function (req, res) {// this function return all of the sites of a specific category
    let categoryid = req.params.categoryid;
    let dbAnswer = db.getAllSitesByCategory(categoryid);
    dbAnswer.then(function (sites) {
        res.send(sites);
    }).catch(function (err) {
        console.log(err);
        res.end();
    });

});


router.get('/photo_url/:siteid', function (req, res) {// this function return all of the urls
    let siteid = req.params.siteid;
    let dbAnswer = db.getAllPhotoUrlBySite(siteid);
    dbAnswer.then(function (urls) {
        res.send(urls);
    }).catch(function (err) {
        console.log(err);
        res.send({message: "bad values"})
    });

});


router.get('/site_reviews/:siteid', function (req, res) {// this function return all of the reviews
    let siteid = req.params.siteid;
    let dbAnswer = db.getAllReviewsBySite(siteid);
    dbAnswer.then(function (reviews) {
        res.send(reviews);
    }).catch(function (err) {
        console.log(err);
        res.send({message: "bad values"})
    });

});
router.post('/views', function (req, res) {//
    let siteID = req.body.siteID;
    let dbAnswer = db.addView(siteID);
    res.end();

});

module.exports = router;