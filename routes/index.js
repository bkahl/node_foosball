var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

var date = new Date();
var d = date.getDate();
var month = date.getMonth()+1;
var h = date.getHours();
var m = date.getMinutes();
var ampm = 'am';
var time;

if(h>12) {
 h=h-12;
 ampm = 'pm';
}

time = h+':'+m+ampm;

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
});

router.get('/player/:id', function(req, res) {
    var userID = req.params.id;
    var db = req.db;
    var collection = db.get('usercollection');

    collection.find( { _id : ObjectId(userID) } ).on('success', function (player) { 
        console.log('player',player[0]);
        res.render('player', { 
            title: player[0].fullname+' ('+player[0].wins+'-'+player[0].losses+')',
            player: player[0],
            userID: userID
        });      
    });
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
        {fullname: req.body.p1name, game: { gameType: 'Singles', position: '*', side: 'yellow', partner: '*', win: (parseInt(req.body.p1score,10) > parseInt(req.body.p2score,10)), loss: (parseInt(req.body.p1score,10) < parseInt(req.body.p2score,10)),  date: date, score: parseInt(req.body.p1score,10), opponentScore: parseInt(req.body.p2score,10), opponentNames: req.body.p2name } },
        {fullname: req.body.p2name, game: { gameType: 'Singles', position: '*', side: 'black', partner: '*', win: (parseInt(req.body.p2score,10) > parseInt(req.body.p1score,10)), loss: (parseInt(req.body.p2score,10) < parseInt(req.body.p1score,10)),  date: date, score: parseInt(req.body.p2score,10), opponentScore: parseInt(req.body.p1score,10), opponentNames: req.body.p1name } }
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

    res.redirect("/standings");
});

/* POST document Doubles new game */
router.post('/newgame2v2', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    var players = [
        {fullname: req.body.p1name, game: { gameType: 'Doubles', position: 'defense', side: 'yellow', partner: req.body.p2name, win: (parseInt(req.body.team1score,10) > parseInt(req.body.team2score,10)), loss: (parseInt(req.body.team1score,10) < parseInt(req.body.team2score,10)),  date: date, score: parseInt(req.body.team1score,10), opponentScore: parseInt(req.body.team2score,10), opponentNames: [req.body.p3name, req.body.p4name] } },
        {fullname: req.body.p2name, game: { gameType: 'Doubles', position: 'offense', side: 'yellow', partner: req.body.p1name, win: (parseInt(req.body.team1score,10) > parseInt(req.body.team2score,10)), loss: (parseInt(req.body.team1score,10) < parseInt(req.body.team2score,10)),  date: date, score: parseInt(req.body.team1score,10), opponentScore: parseInt(req.body.team2score,10), opponentNames: [req.body.p3name, req.body.p4name] } },
        {fullname: req.body.p3name, game: { gameType: 'Doubles', position: 'defense', side: 'black', partner: req.body.p4name, win: (parseInt(req.body.team2score,10) > parseInt(req.body.team1score,10)), loss: (parseInt(req.body.team2score,10) < parseInt(req.body.team1score,10)),  date: date, score: parseInt(req.body.team2score,10), opponentScore: parseInt(req.body.team1score,10), opponentNames: [req.body.p1name, req.body.p2name] } },
        {fullname: req.body.p4name, game: { gameType: 'Doubles', position: 'offense', side: 'black', partner: req.body.p3name, win: (parseInt(req.body.team2score,10) > parseInt(req.body.team1score,10)), loss: (parseInt(req.body.team2score,10) < parseInt(req.body.team1score,10)),  date: date, score: parseInt(req.body.team2score,10), opponentScore: parseInt(req.body.team1score,10), opponentNames: [req.body.p1name, req.body.p2name] } }
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

    res.redirect("/standings");
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
        "joined": date,
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

/* Remove User By ID */
router.get('/removeuser/:page/:id', function(req, res) {
    // Set our internal DB variable
    var db = req.db;

    var removeUserID = req.params.id;
    var page = req.params.page;

    // Set our collection
    var collection = db.get('usercollection');

    collection.remove({ _id : ObjectId(removeUserID) });  

    res.redirect('/'+page);
});

router.get('/removegame/:page/:id/:gameindex', function(req, res) {
    // Set our internal DB variable
    var db = req.db;

    var userID = req.params.id;
    var page = req.params.page;
    var gameindex = req.params.gameindex;

    // Set our collection
    var collection = db.get('usercollection');

    var removedGame,
        removedGameObj = {},
        updatedUserObj = {};

    collection.find({'_id': ObjectId(userID)}).on('success', function (player) { 
        console.log('player',player[0]);  
        removedGame = player[0].games.splice(gameindex,1); 
        console.log('removedGame',removedGame[0]);    

        removedGameObj.gameType = removedGame[0].gameType;
        removedGameObj.position = removedGame[0].position;
        removedGameObj.side = removedGame[0].side;
        removedGameObj.win = removedGame[0].win;
        removedGameObj.loss = removedGame[0].loss;
        removedGameObj.score = removedGame[0].score;
        removedGameObj.opponentScore = removedGame[0].opponentScore;

        updatedUserObj.fullname = player[0].fullname;
        updatedUserObj.fname = player[0].fname;
        updatedUserObj.lname = player[0].lname;
        updatedUserObj.email = player[0].email;
        updatedUserObj.joined = player[0].joined;
        updatedUserObj.goalsFor = player[0].goalsFor-removedGameObj.score;
        updatedUserObj.goalsAgainst = player[0].goalsAgainst-removedGameObj.opponentScore;
        updatedUserObj.wins = (removedGameObj.win) ? player[0].wins-1 : player[0].wins-0;
        updatedUserObj.losses = (removedGameObj.loss) ? player[0].losses-1 : player[0].losses-0;
        updatedUserObj.gamesPlayed = player[0].gamesPlayed-1;
        updatedUserObj.onDefense = (removedGameObj.position === '*' || removedGameObj.position === 'offense') ? player[0].onDefense-0 : player[0].onDefense-1;
        updatedUserObj.onOffense = (removedGameObj.position === '*' || removedGameObj.position === 'defense') ? player[0].onOffense-0 : player[0].onOffense-1;
        updatedUserObj.blackSide = (removedGameObj.side === 'black') ? player[0].blackSide-1: player[0].blackSide-0;
        updatedUserObj.yellowSide = (removedGameObj.side === 'yellow') ? player[0].yellowSide-1: player[0].yellowSide-0;
        updatedUserObj.doubleMatches = (removedGameObj.gameType === 'Doubles') ? player[0].doubleMatches-1 : player[0].doubleMatches-0;
        updatedUserObj.singleMatches = (removedGameObj.gameType === 'Singles') ? player[0].singleMatches-1 : player[0].singleMatches-0;
        updatedUserObj.games = player[0].games;

        console.log('removedGameObj',removedGameObj);
        console.log('updatedUserObj',updatedUserObj);

        collection.update(
            {'_id': ObjectId(userID)},
            {
                fullname: updatedUserObj.fullname,
                fname: updatedUserObj.fname,
                lname: updatedUserObj.lname,
                email: updatedUserObj.email,
                joined: updatedUserObj.joined,
                goalsFor: updatedUserObj.goalsFor,
                goalsAgainst: updatedUserObj.goalsAgainst,
                wins: updatedUserObj.wins,
                losses: updatedUserObj.losses,
                gamesPlayed: updatedUserObj.gamesPlayed,
                onDefense: updatedUserObj.onDefense,
                onOffense: updatedUserObj.onOffense,
                blackSide: updatedUserObj.blackSide,
                yellowSide: updatedUserObj.yellowSide,
                doubleMatches: updatedUserObj.doubleMatches,
                singleMatches: updatedUserObj.singleMatches,
                games: updatedUserObj.games
            }
        ); 
    });

    res.redirect('/'+page+'/'+userID);
});

module.exports = router;
