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

router.delete('/delFavorite', function (req, res) {// delete favorite site for user - oved
    let siteID = req.body.siteID;
    let userName = req.body.userName;
    db.deleteFavorite(siteID, userName);
    res.end();
});

router.post('/add_favorite_sites', function (req, res) {//maybe need to change here the restore in the green part -oved
    if (!req.body.userName)
        res.send({message: "bad values"});
    else {
        let userName = req.body.userName;
        db.addFavoritesPerUser(userName, req.body.favorites);
        res.end();
    }

});
router.post('/rank', function (req, res) {//maybe need to change here the restore in the green part -oved
    /*  if ( !req.body.siteID || !req.body.rank) {
          res.send({message: "bad values"})
      }*/
    //else {
    //let userName = req.body.userName;
    let siteID = req.body.siteID;
    let rank = req.body.rank;
    //let date = req.body.date;
    let dbAnswer = db.updateRank(siteID, rank);
    res.end();
    //}
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
            res.send({message: "bad values"})
        });
    }
});

router.get('/last_saved/:userName', function (req, res) {//maybe need to change here the restore in the green part -oved
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


module.exports = router;