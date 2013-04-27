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