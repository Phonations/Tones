exports.init = function(req, res){
  if(req.isAuthenticated()){
    //res.redirect('/'+req.user._doc.username);
    res.redirect('/'+req.user._doc.url);
  } else{
    res.render('index', { title: 'PublicTones'});
  }
};