/*
 * Module dependencies
 */

var app = module.parent.exports.app
  , passport = require('passport')
  , client = module.parent.exports.client
  , config = require('../config')
  , utils = require('../utils')
  , User = require('../providers/user').User
  , Station = require('../providers/station').Station;


/*
 * GET login page
 * if the user is authenticated we can redirect him to the home page
 */
app.get('/', function(req, res, next){
  if(req.isAuthenticated()){
    console.log('req.isAuthenticated');
    console.log('req.user:'+req.user._doc.username);
    res.redirect('/home');
  } else{
    res.render('index', { title: 'login'});
  }
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/login-valid',
    failureRedirect: '/login-failure'
  })
);

app.get('/login-valid',function (req, res){
  res.send(config.message.valid);
});

app.get('/login-failure',function (req, res){
    res.send(config.message.login_invalid);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

/*
 * GET signup page.
 * when the user want to sign up for a new account
 */

app.get('/signup', function(req, res){
  res.render('signup', { title: 'Create an account' });
});

app.post('/signup', function(req, res){
  var user = new User({
    'username':req.body.username,
    'email':req.body.email,
    'password':utils.encodePassword(req.body.password)
  });

  user.save(function(err, user){
    if(err) res.send({'error':'An error has occurred'});
    user.speak();
    res.redirect('/');
  });
});

/*
 * GET home page.
 * on this page the user can create station or search for a station
 */

app.get('/home', utils.restrict, function(req, res){
  Station.find().limit(10).exec(function(err, stations){
    if(err) res.send({'error':'An error has occurred'});
    res.render('home', {
      title: 'home',
      stations: stations,
      username: req.user._doc.username
    });
  });
});

app.post('/create-station', utils.restrict, function(req, res){
  console.log('we are creating a station');
  var station = new Station({
    'name':req.body.name,
    'id_user_create':req.user._id,
    'nb_users':req.body.nb_users,
    'nb_tones':req.body.nb_tones,
    'current': 0
  });

  station.save(function(err, station){
    if(err) res.send({"error":1, "message": config.message.error_create_station});
    res.send({"error":0, "message":station._id});
  });
});

app.post('/stations', utils.restrict, function(req, res){
  var regex = new RegExp(req.body.search, 'i');
  Station.find({'name':regex}).limit(10).exec(function(err, stations){
    if(err) res.send({'error':'An error has occurred'});
    res.send(stations);
  });
});



/*
 * GET station page.
 * on this page the user can create station or search for a station
 */ 
app.get('/station/:id', utils.restrict, function(req, res){
  Station.findById(req.params.id).exec(function(err, station){
    console.log('req.user._id:'+req.user._doc._id);
    res.render('station', {
      title: 'station - '+station.name,
      user: req.user._doc,
      station: station
    });
  });
});

app.get('/radio', utils.restrict, function(req, res){
  res.render('radio', {
    title: 'radio',
    nickname: req.user._doc.username
  });
});
