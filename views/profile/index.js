var config = require('../../config')
  , User = require('../../providers/user').User
  , utils = require('../../utils')
  , Station = require('../../providers/station').Station;

exports.init = function (req, res){
  // get the user
  User.find({'username':req.params.username}).exec(function(err, users){
    if(err) res.send({'error':'1. An error has occurred'});
    if(users.length>0){
      // get the stations the user created
      var user_profile = users[0];
      Station.find({'id_user_create':user_profile._id}).exec(function(err, stations){
        if(err) res.send({'error':'2. An error has occurred'});
        user_profile.stations = stations;
          // get the tones of the user connected
        utils.getTonesByUser(user_profile._id, function(tones){
          user_profile.tones = tones;
          // get the current station of the user connected
          utils.getStationDetails(user_profile.current_station, req, res, function(station){
            user_profile.station = station;
            res.render('profile', {
              title: user_profile.username,
              user_profile: user_profile,
              user: req.user._doc
            });
          });
        });
      });
    }else{
      res.redirect('/'+req.user._doc.username);
    }
  });
}