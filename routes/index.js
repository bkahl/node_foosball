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

router.get('/standings', function(req, res) {
    res.render('standings', { title: 'Standings' });
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
        "email" : userEmail
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
