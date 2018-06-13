var express = require('express');
var router = express.Router();
var db = require("../DButils");

router.get('/', function (req, res) {
    res.send({message: 'Welcome to area for registered users only!!'})
});
router.post('/review', function (req, res) {//
    if (!req.body.userName || !req.body.siteID || !req.body.review || !req.body.date) {
        res.send({message: "bad values"})
    }
    else {
        let userName = req.body.userName;
        let siteID = req.body.siteID;
        let review = req.body.review;
        let date = req.body.date;
        db.postReview(siteID, review, date, userName);
        res.end();
    }
});

router.delete('/delFavorite', function (req, res) {// delete favorite site for user
    let siteID = req.body.siteID;
    let userName = req.body.userName;
    db.deleteFavorite(siteID, userName);
    res.end();
});

router.post('/add_favorite_sites', function (req, res) {// add favorite site for user
    if (!req.body.userName)
        res.send({message: "bad values"});
    else {
        let userName = req.body.userName;
        db.addFavoritesPerUser(userName, req.body.favorites);
        res.end();
    }

});
router.post('/rank', function (req, res) {// add new rank to site and update
    let siteID = req.body.siteID;
    let rank = req.body.rank;
    db.updateRank(siteID, rank);
    res.end();
});

router.get('/favorites/:userName', function (req, res) {//return all the favorite sites of  a user
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
            res.send({message: "bad values"})
        });
    }
});

router.get('/last_saved/:userName', function (req, res) {//return all favorites sites of a user sorted by date
    if (!req.params.userName) {
        res.send({message: "bad values"})
    }
    else {
        let userName = req.params.userName;
        let dbAnswer = db.getLastSaved(userName);
        dbAnswer.then(function (favorites) {
            res.send(favorites);
        }).catch(function (err) {
            console.log(err);
            res.send({message: "bad values"})
        });
    }
});

router.get('/categories/:username', function (req, res) {
    let userName = req.params.username;
    let dbAnswer = db.getAllCategoriesByUser(userName);
    dbAnswer.then(function (categories) {
        res.send(categories);
    }).catch(function (err) {
        console.log(err);
        res.end();
    });

});

module.exports = router;