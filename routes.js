/*
 * Module dependencies
 */

var config = require('./config')
  , utils = require('./utils')
  , User = require('./providers/user').User
  , Station = require('./providers/station').Station;


exports = module.exports = function(app, passport) {

  //front end
  app.get('/', require('./views/index').init);

  // login/out
  app.get('/login', require('./views/login').init);
  app.get('/login/', require('./views/login').init);
  app.post('/login', require('./views/login').login);
  app.post('/login/', require('./views/login').login);
  app.get('/login-failure', require('./views/login').loginfailure);
  app.get('/login-failure/', require('./views/login').loginfailure);
  app.get('/login/forgot/', require('./views/login/forgot/index').init);
  app.post('/login/forgot/', require('./views/login/forgot/index').send);
  app.get('/login/reset/', require('./views/login/reset/index').init);
  app.get('/login/reset/:token/', require('./views/login/reset/index').init);
  app.put('/login/reset/:token/', require('./views/login/reset/index').set);
  app.get('/logout/', require('./views/logout/index').init);

  //sign up
  app.get('/signup', require('./views/signup/index').init);
  app.get('/signup/', require('./views/signup/index').init);
  app.post('/signup', require('./views/signup/index').signup);
  app.post('/signup/', require('./views/signup/index').signup);
  app.post('/check-username', require('./views/signup/index').checkusername);
  app.post('/check-email', require('./views/signup/index').checkemail);

  // profile page
  app.get('/:username', utils.restrict, require('./views/profile/index').init);
  app.get('/:username/', utils.restrict, require('./views/profile/index').init);

  // modal actions
  app.post('/create-station', utils.restrict, require('./views/modal/index').createstation);


/*
 * Authentication routes


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
  app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/'
    })
  );
}
 */
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
}
