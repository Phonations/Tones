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
    res.render('index', { title: 'PublicTones'});
  }
});
app.get('/login',function (req, res){
    res.render('login', 
    { 
      title: 'Sign in to PublicTones',
      message: ''
    });
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login-failure'
  })
);

app.get('/login-failure',function (req, res){
    res.render('login', 
    { 
      title: 'Houston we have a problem!',
      message: config.message.login_invalid
    });
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

  res.render('signup', { title: 'Create an account',
      fullname: '',
      email: '',
      password: '',
      message:''
  });
});

app.post('/signup', function(req, res){

  if(req.body.from == 'index'){
    res.render('signup', { 
      title: 'Create an account',
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      message:''
    });
  }
       
  if(req.body.from == 'signup'){
    utils.createUser(req.body, function(err, user){
      if(err) {
        res.render('signup', { 
          title: 'Create an account',
          fullname: req.body.fullname,
          email: req.body.email,
          password: req.body.password,
          message: config.message.signup_error
        });
      }
      res.redirect('/signup-login');
      /*passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login-failure'
      })*/
    });
  }
});
app.post('/signup-login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login-failure'
  })
);

app.post('/check-username', function(req, res){
  User.find({'username':req.body.username}).exec(function(err, users){
    if(err) res.send({'error':1});
    if(users.length>0){
      res.send({'error':1});
    }else{
      res.send({'error':0});
    }
  });
});


app.post('/check-email', function(req, res){
  User.find({'email':req.body.email}).exec(function(err, users){
    if(err) res.send({'error':1});
    if(users.length>0){
      res.send({'error':1});
    }else{
      res.send({'error':0});
    }
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
  console.log('/station/'+req.params.id);
  Station.findById(req.params.id).exec(function(err, station){
    if(err) res.send({'error':'An error has occurred'});
    utils.getUserInfo(req.user._doc, station, function(user){
      utils.getUsers(station.users, function(users){
        station.users = users;
        utils.getTones(station.tones, function(tones){
          station.tones = tones;
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


app.get('/:id', utils.restrict, function(req, res){
  res.render('profile', {
    title: req.params.id,
    username: req.user._doc.username
  });
});
