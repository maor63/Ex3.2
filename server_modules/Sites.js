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


router.post('/review', function (req, res) {//maybe need to change here the restore in the green part -oved
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

router.delete('/delFavorite', function (req, res) {// delete favorite site for user - oved
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

router.get('/all', function (req, res) {// this function return all of the sites - OVED
    //let siteName = req.params.sitename;
    let dbAnswer = db.getAllSites();
    dbAnswer.then(function (sites) {
        res.send(sites);
    }).catch(function (err) {
        console.log(err);
        res.end();
    });

});

router.get('/allbycategoryid/:categoryid', function (req, res) {// this function return all of the sites - OVED
    let categoryid = req.params.categoryid;
    let dbAnswer = db.getAllSitesByCategory(categoryid);
    dbAnswer.then(function (sites) {
        res.send(sites);
    }).catch(function (err) {
        console.log(err);
        res.end();
    });

});
//addFavoritePerUser
router.post('/addFavoriteSites', function (req, res) {//maybe need to change here the restore in the green part -oved
    if (!req.body.userName)
        res.send({message: "bad values"});
    else
    {
        let userName = req.body.userName;
       // let siteIDs=req.body.siteIDs;
        db.addFavoritePerUser(userName, [1,2]);
        res.end();
    }

});

router.get('/photourl/:siteid', function (req, res) {// this function return all of the urls- OVED
    let siteid = req.params.siteid;
    let dbAnswer = db.getAllPhotoUrlBySite(siteid);
    dbAnswer.then(function (urls) {
        res.send(urls);
    }).catch(function (err) {
        console.log(err);
        res.end();
    });

});


router.get('/sitereviews/:siteid', function (req, res) {// this function return all of the reviews -oved
    let siteid = req.params.siteid;
    let dbAnswer = db.getAllReviewsBySite(siteid);
    dbAnswer.then(function (reviews) {
        res.send(reviews);
    }).catch(function (err) {
        console.log(err);
        res.end();
    });

});

router.post('/rank', function (req, res) {//maybe need to change here the restore in the green part -oved
    if (!req.body.userName || !req.body.siteID || !req.body.review || !req.body.date) {
        res.send({message: "bad values"})
    }
    else {
        //let userName = req.body.userName;
        let siteID = req.body.siteID;
        let rank = req.body.rank;
        //let date = req.body.date;
        let dbAnswer = db.updateRank(siteID, rank);
        res.end();
    }
});

router.get('/favorites/:userName', function (req, res) {//maybe need to change here the restore in the green part -oved
    if (!req.params.userName) {
        res.send({message: "bad values"})
    }
    else {
        let userName = req.params.userName;
        let dbAnswer = db.getFavorites(userName);
        dbAnswer.then(function (favorites) {
            res.send(favorites);
        }).catch(function (err) {
            console.log(err);
            res.end();
        });
    }
});

module.exports = router;