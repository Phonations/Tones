
var config = require('../../config')
  , utils = require('../../utils')
  , passport = require('passport')
  , User = require('../../providers/user').User;

exports.init = function(req, res){
  res.render('signup', { title: 'Create an account',
      fullname: '',
      email: '',
      password: '',
      message:''
  });
};


exports.signup = function(req, res){
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
    });
  }
}


exports.checkusername = function(req, res){
  User.find({'username':req.body.username}).exec(function(err, users){
    if(err) res.send({'error':1});
    if(users.length>0){
      res.send({'error':1});
    }else{
      res.send({'error':0});
    }
  });
}


exports.checkemail = function(req, res){
  User.find({'email':req.body.email}).exec(function(err, users){
    if(err) res.send({'error':1});
    if(users.length>0){
      res.send({'error':1});
    }else{
      res.send({'error':0});
    }
  });
}