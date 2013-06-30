
var config = require('../../config')
  , utils = require('../../utils')
  , passport = require('passport')
  , User = require('../../controller/user')
  , UserProvider = require('../../providers/user').User;

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


exports.signupFacebook = function(req, res, next) {
  passport.authenticate('facebook', { callbackURL: config.auth.facebook.callback }, function(err, info) {
    console.log(info);

    if(req.isAuthenticated()){
      console.log('req.user._doc.username isAuthenticated');
    }else{
      console.log('is not Authenticated');
    }
    
    req.login(info, function(err) {
      if (err) return next(err);
      
      res.redirect('/');
    });
    //if (!info || !info.profile) return res.redirect('/signup/');
    
    // we check if the user exist 

    /*UserProvider.findOne({ 'facebook.id': info.profile.id }, function(err, user) {
      if (err) return next(err);
      console.log("info.profile.emails[0].value:"+info.profile.emails[0].value)
      /*
      if (!user) {
        req.session.socialProfile = info.profile;
        res.render('signup/social', { email: info.profile.emails[0].value || '' });
      }
      else {
        res.render('signup/index', {
          oauthMessage: 'We found a user linked to your Facebook account.',
          oauthTwitter: !!req.app.get('twitter-oauth-key'),
          oauthGitHub: !!req.app.get('github-oauth-key'),
          oauthFacebook: !!req.app.get('facebook-oauth-key')
        });
      }
    });*/
  })(req, res, next);

};
/*
exports.signupSocial = function(req, res){
  var workflow = new req.app.utility.Workflow(req, res);
  
  workflow.on('validate', function() {
    if (!req.body.email) {
      workflow.outcome.errfor.email = 'required';
    }
    else if (!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.email)) {
      workflow.outcome.errfor.email = 'invalid email format';
    }
    
    //return if we have errors already
    if (workflow.hasErrors()) return workflow.emit('response');
    
    workflow.emit('duplicateUsernameCheck');
  });
  
  workflow.on('duplicateUsernameCheck', function() {
    workflow.username = req.session.socialProfile.username;
    if (!/^[a-zA-Z0-9\-\_]+$/.test(workflow.username)) {
      workflow.username = workflow.username.replace(/[^a-zA-Z0-9\-\_]/g, '');
    }
    
    req.app.db.models.User.findOne({ username: workflow.username }, function(err, user) {
      if (err) return workflow.emit('exception', err);
      
      if (user) {
        workflow.username = workflow.username + req.session.socialProfile.id;
      }
      else {
        workflow.username = workflow.username;
      }
      
      workflow.emit('duplicateEmailCheck');
    });
  });
  
  workflow.on('duplicateEmailCheck', function() {
    req.app.db.models.User.findOne({ email: req.body.email }, function(err, user) {
      if (err) return workflow.emit('exception', err);
      
      if (user) {
        workflow.outcome.errfor.email = 'email already registered';
        return workflow.emit('response');
      }
      
      workflow.emit('createUser');
    });
  });
  
  workflow.on('createUser', function() {
    var fieldsToSet = {
      isActive: 'yes',
      username: workflow.username,
      email: req.body.email,
      search: [
        workflow.username,
        req.body.email
      ]
    };
    fieldsToSet[req.session.socialProfile.provider] = req.session.socialProfile._json;
    
    req.app.db.models.User.create(fieldsToSet, function(err, user) {
      if (err) return workflow.emit('exception', err);
      
      workflow.user = user;
      workflow.emit('createAccount');
    });
  });
  
  workflow.on('createAccount', function() {
    var nameParts = req.session.socialProfile.displayName.split(' ');
    var fieldsToSet = {
      'name.first': nameParts[0],
      'name.last': nameParts[1] || '',
      'name.full': req.session.socialProfile.displayName,
      user: {
        id: workflow.user._id,
        name: workflow.user.username
      },
      search: [
        nameParts[0],
        nameParts[1] || ''
      ]
    };
    req.app.db.models.Account.create(fieldsToSet, function(err, account) {
      if (err) return workflow.emit('exception', err);
      
      //update user with account
      workflow.user.roles.account = account._id;
      workflow.user.save(function(err, user) {
        if (err) return workflow.emit('exception', err);
        workflow.emit('sendWelcomeEmail');
      });
    });
  });
  
  workflow.on('sendWelcomeEmail', function() {
    req.app.utility.email(req, res, {
      from: req.app.get('email-from-name') +' <'+ req.app.get('email-from-address') +'>',
      to: req.body.email,
      subject: 'Your '+ req.app.get('project-name') +' Account',
      textPath: 'signup/email-text',
      htmlPath: 'signup/email-html',
      locals: {
        username: workflow.user.username,
        email: req.body.email,
        loginURL: 'http://'+ req.headers.host +'/login/',
        projectName: req.app.get('project-name')
      },
      success: function(message) {
        workflow.emit('logUserIn');
      },
      error: function(err) {
        console.log('Error Sending Welcome Email: '+ err);
        workflow.emit('logUserIn');
      }
    });
  });
  
  workflow.on('logUserIn', function() {
    req.login(workflow.user, function(err) {
      if (err) return workflow.emit('exception', err);
      
      delete req.session.socialProfile;
      workflow.outcome.defaultReturnUrl = workflow.user.defaultReturnUrl();
      workflow.emit('response');
    });
  });
  
  workflow.emit('validate');
};*/