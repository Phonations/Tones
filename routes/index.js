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
    //res.redirect('/'+req.user._doc.username);
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
app.post('/forgot', function(req, res){
  //TODO: we need to add the forgot
  res.redirect('/');
})


/*
 * Authentication routes
 */

if(config.auth.twitter.consumerkey.length) {
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/'
    })
  );
}

if(config.auth.facebook.clientid.length) {
  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/'
    })
  );
}

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

      //TODO: we need to verify the email

      passport.authenticate('local', function(err, user, info) {
        if (err) { return console.log(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
          if (err) { return console.log(err); }
          return res.redirect('/home');
        });
      })(req, res);

      /*res.redirect('/signup-login');
      passport.authenticate('local', {
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
      username: req.user.displayName
    });
  });
});

app.post('/create-station', utils.restrict, function(req, res){
  var station = new Station({
    'title':req.body.title,
    'url':req.body.title.replace(/\s+/g, '-').toLowerCase(),
    'id_user_create':req.user._doc._id+'',
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
  Station.find({'title':regex}).limit(10).exec(function(err, stations){
    if(err) res.send({'error':'An error has occurred'});
    res.send(stations);
  });
});



/*
 * GET station page.
 * this is the station page 
 */ 
app.get('/station/:id', utils.restrict, function(req, res){
  utils.getStation(req, res, function(station, user){
    res.render('station', {
      title: 'station - '+station.title,
      user: user,
      station: station
    });
  });
});
/*
 * GET profile page.
 * this is the profile page 
 */ 
app.get('/:username', utils.restrict, function(req, res){
  // first we get the user
  User.find({'username':req.params.username}).exec(function(err, users){
    if(err) res.send({'error':'1. An error has occurred'});
    if(users.length>0){
      // second we get the stations the user created
      var user_profile = users[0];
      Station.find({'id_user_create':users[0]._id}).exec(function(err, stations){
        if(err) res.send({'error':'2. An error has occurred'});
        user_profile.stations = stations;
        // third we get the current station of the user connected
        utils.getStationDetails(user_profile.current_station, req, res, function(station){
          user_profile.station = station;
          res.render('profile', {
            title: user_profile.username,
            user_profile: user_profile,
            user: req.user._doc
          });
        });
      });
    }else{
      res.redirect('/'+req.user._doc.username);
    }
  });
});

/*
 * GET station page.
 * this is the station page 
*/
app.get('/:username/s/:title', utils.restrict, function(req, res){
  /*switch(req.params.username){
    case 'javascripts':
    case 'font':
    case 'images':
    case 'stylessheets':
    case 'socket.io':
      app.set('/'+req.params.username+'/'+req.params.title);
      break;
    default:
      console.log('/:username/:title : '+req.params.username+'/'+req.params.title);*/
      utils.getStation2(req, res, function(station, user){
        res.render('station', {
          title: 'station - '+station.title,
          user: user,
          station: station
        });
      });
 // }
});

