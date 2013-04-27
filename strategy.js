exports = module.exports = function(app, passport) {
  var LocalStrategy = require('passport-local').Strategy
    , TwitterStrategy = require('passport-twitter').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy 
    , User = require('./providers/user').User
    , config = require('./config.json');

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new LocalStrategy({
      usernameField: 'email'
    },
    function(username, password, done) {
      User.findOne({ email: username }, function(err, user) {
        if (err) { 
          return done(err); 
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

  if(config.auth.twitter.consumerkey.length) {
    passport.use(new TwitterStrategy({
        consumerKey: config.auth.twitter.consumerkey,
        consumerSecret: config.auth.twitter.consumersecret,
        callbackURL: config.auth.twitter.callback
      },
      function(token, tokenSecret, profile, done) {
        console.log(profile.provider+':'+profile.displayName+', '+profile.id);
        //console.log('username:'+req.user._doc.username);
        return done(null, profile);
      }
    ));
  } 

  if(config.auth.facebook.clientid.length) {
    passport.use(new FacebookStrategy({
        clientID: config.auth.facebook.clientid,
        clientSecret: config.auth.facebook.clientsecret,
        callbackURL: config.auth.facebook.callback
      },
      function(accessToken, refreshToken, profile, done) {
        console.log(profile.provider+':'+profile.displayName+', '+profile.id);
        for (var i =0;i<profile.emails.length; i++){
          console.log(profile.emails[i].type+':'+profile.emails[i].value);
        }
        return done(null, profile);
      }
    ));
  }
}