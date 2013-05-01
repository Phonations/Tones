
var config = require('../../config')
  , utils = require('../../utils')
  , passport = require('passport')
  , User = require('../../controller/user');

exports.init = function(req, res){
  res.render('signup', { title: 'Create an account',
      fullname: '',
      email: '',
      password: '',
      message:''
  });
};


exports.signup = function(req, res){
  // if post come from the index page, it auto populate the signup page
  if(req.body.from == 'index'){
    res.render('signup', { 
      title: 'Create an account',
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      message:''
    });
  }
       
  // Recieving the posting data from sign up form
  // req.body.fullname
  // req.body.email
  // req.body.password
  // req.body.username
  if(req.body.from == 'signup'){
    User.createUser(req.body, function(err, user){
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
          return res.redirect('/');
        });
      })(req, res);
    });
  }
}


exports.checkusername = function(req, res){
  User.getUserByUsername(req.body.username, function(err, data){
    if(err) res.send({'error':1});
    else{
      if(data){
        res.send({'error':1});
      }else{
        res.send({'error':0});
      }
    }
  });
}


exports.checkemail = function(req, res){
  User.getUserByEmail(req.body.email, function(err, data){
    if(err) res.send({'error':1});
    else{
      if(data){
        res.send({'error':1});
      }else{
        res.send({'error':0});
      }
    }
  });
}