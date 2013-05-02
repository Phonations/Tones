exports.init = function(req, res){
  console.log('logout');
  req.logout();
  res.redirect('/');
};
