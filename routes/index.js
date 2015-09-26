var express = require('express');
var router = express.Router();

var movies = require('../movies.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express', data: movies });

  var db = req.db;
    var collection = db.get('moviecollection');
    collection.find({},{},function(e,movies){
        res.render('index', {
            title: 'Express',
            data: movies
        });
    });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New Player' });
});

/* GET Standings page data. */
router.get('/standings', function(req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Set our collection
    var collection = db.get('usercollection');

    collection.find({
        $query: {},
        $orderby: { wins: -1 } 
    },function(e,users){
        res.render('standings', {
            title: 'Standings',
            userlist : users
        });
    });
    //res.render('standings', { title: 'Standings' });
});

router.get('/newgame', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('newgame', {
            title: 'New Game',
            'userlist' : docs
        });
    });
});

/* POST document Singles new game */
router.post('/newgame1v1', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    var players = [
        {fullname: req.body.p1name, game: { gameType: 'Singles', position: '*', side: 'yellow', partner: '*', win: (parseInt(req.body.p1score,10) > parseInt(req.body.p2score,10)), loss: (parseInt(req.body.p1score,10) < parseInt(req.body.p2score,10)),  date: new Date(), score: parseInt(req.body.p1score,10), opponentScore: parseInt(req.body.p2score,10), opponentNames: req.body.p2name } },
        {fullname: req.body.p2name, game: { gameType: 'Singles', position: '*', side: 'black', partner: '*', win: (parseInt(req.body.p2score,10) > parseInt(req.body.p1score,10)), loss: (parseInt(req.body.p2score,10) < parseInt(req.body.p1score,10)),  date: new Date(), score: parseInt(req.body.p2score,10), opponentScore: parseInt(req.body.p1score,10), opponentNames: req.body.p1name } }
    ];

    // Set our collection
    var collection = db.get('usercollection');

    for(i=0;i < players.length; i++){
        collection.update(
            { fullname : players[i].fullname }, 
            { 
                $inc: { 
                    goalsFor: +players[i].game.score,
                    goalsAgainst: +players[i].game.opponentScore,
                    wins: (players[i].game.win) ? +1 : +0,
                    losses: (players[i].game.loss) ? +1 : +0,
                    gamesPlayed: +1,
                    yellowSide: (players[i].game.side === 'yellow') ? +1 : 0,
                    blackSide: (players[i].game.side === 'black') ? +1 : 0,
                    singleMatches: +1
                },
                $push : {
                    games : players[i].game
                }
            }
        );   
    }

    res.redirect("/");
});

/* POST document Doubles new game */
router.post('/newgame2v2', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    var players = [
        {fullname: req.body.p1name, game: { gameType: 'Doubles', position: 'defense', side: 'yellow', partner: req.body.p2name, win: (parseInt(req.body.team1score,10) > parseInt(req.body.team2score,10)), loss: (parseInt(req.body.team1score,10) < parseInt(req.body.team2score,10)),  date: new Date(), score: parseInt(req.body.team1score,10), opponentScore: parseInt(req.body.team2score,10), opponentNames: [req.body.p3name, req.body.p4name] } },
        {fullname: req.body.p2name, game: { gameType: 'Doubles', position: 'offense', side: 'yellow', partner: req.body.p1name, win: (parseInt(req.body.team1score,10) > parseInt(req.body.team2score,10)), loss: (parseInt(req.body.team1score,10) < parseInt(req.body.team2score,10)),  date: new Date(), score: parseInt(req.body.team1score,10), opponentScore: parseInt(req.body.team2score,10), opponentNames: [req.body.p3name, req.body.p4name] } },
        {fullname: req.body.p3name, game: { gameType: 'Doubles', position: 'defense', side: 'black', partner: req.body.p4name, win: (parseInt(req.body.team2score,10) > parseInt(req.body.team1score,10)), loss: (parseInt(req.body.team2score,10) < parseInt(req.body.team1score,10)),  date: new Date(), score: parseInt(req.body.team2score,10), opponentScore: parseInt(req.body.team1score,10), opponentNames: [req.body.p1name, req.body.p2name] } },
        {fullname: req.body.p4name, game: { gameType: 'Doubles', position: 'offense', side: 'black', partner: req.body.p3name, win: (parseInt(req.body.team2score,10) > parseInt(req.body.team1score,10)), loss: (parseInt(req.body.team2score,10) < parseInt(req.body.team1score,10)),  date: new Date(), score: parseInt(req.body.team2score,10), opponentScore: parseInt(req.body.team1score,10), opponentNames: [req.body.p1name, req.body.p2name] } }
    ];

    // Set our collection
    var collection = db.get('usercollection');

    for(i=0;i < players.length; i++){
        console.log(collection.find())
        collection.update(
            { fullname : players[i].fullname }, 
            { 
                $inc: { 
                    goalsFor: +players[i].game.score,
                    goalsAgainst: +players[i].game.opponentScore,
                    wins: (players[i].game.win) ? +1 : +0,
                    losses: (players[i].game.loss) ? +1 : +0,
                    gamesPlayed: +1,
                    onDefense: (players[i].game.position === 'defense') ? +1 : 0,
                    onOffense: (players[i].game.position === 'offense') ? +1 : 0,
                    yellowSide: (players[i].game.side === 'yellow') ? +1 : 0,
                    blackSide: (players[i].game.side === 'black') ? +1 : 0,
                    doubleMatches: +1
                },
                $push : {
                    games : players[i].game
                }
            }
        );   
    }

    res.redirect("/");
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userFirstName = req.body.fname;
    var userLastName = req.body.lname;
    var userFullName = userFirstName+" "+userLastName;
    var userEmail = req.body.email;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "fullname" : userFullName,
        "fname" : userFirstName,
        "lname" : userLastName,
        "email" : userEmail,
        "joined": new Date(),
        "goalsFor" : 0,
        "goalsAgainst" : 0,
        "wins" : 0,
        "losses" : 0,
        "gamesPlayed" : 0,
        "onDefense" : 0,
        "onOffense" : 0,
        "blackSide" : 0,
        "yellowSide" : 0,
        "doubleMatches" : 0,
        "singleMatches" : 0
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

module.exports = router;
