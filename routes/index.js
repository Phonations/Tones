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

  utils.createUser(req.body, res, function(err, user){
    if(err) res.send(config.message.valid);
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
  console.log('/station/'+req.params.id)
  Station.findById(req.params.id).exec(function(err, station){
    if(err) res.send({'error':'An error has occurred'});
    utils.getUserInfo(req.user._doc, station, function(user){
      utils.getUsers(station.users, function(users){
        station.users = users
        utils.getTones(station.tones, function(tones){
          station.tones = tones
          utils.getMessages(station.messages, function(messages){
            res.render('station', {
              title: 'station - '+station.name,
              user: user,
              station: station
            });
          });
        });
      });
    });
  });
});

app.get('/radio', utils.restrict, function(req, res){
  res.render('radio', {
    title: 'radio',
    nickname: req.user._doc.username
  });
});
