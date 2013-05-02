exports.init = function(req, res){
  console.log('/ init');
  if(req.isAuthenticated()){
    //res.redirect('/'+req.user._doc.username);
    res.redirect('/'+req.user._doc.url);
  } else{
    res.render('index', { title: 'PublicTones'});
  }
};