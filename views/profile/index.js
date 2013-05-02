var config = require('../../config')
  , utils = require('../../utils')
  , User = require('../../controller/user')
  , Station = require('../../controller/station')
  , Tone = require('../../controller/tone')
  , Like = require('../../controller/like');

exports.init = function (req, res){
  console.log('[view/profile] init:');
  // get the user
  User.getUserByUrl(req.params.username, function(err, data){
    if(err){ 
      if(err) res.send(data);
    }else{
      // get the stations the user created
      var user_profile = data;
      Station.getStationsByUser(user_profile, function(err, data){
        if(err){ 
          if(err) res.send(data);
        }else{
          user_profile.stations = data;
          // get the tones of the user connected
          Tone.getTonesByUser(user_profile, function(err, data){
            if(err){ 
              res.send(data);
            }else{
                  user_profile.tones = data;
              // get the Likes of the user connected
              Like.getLikesByUser(user_profile, function(err, data){
                if(err){ 
                  res.send(data);
                }else{
                  user_profile.likes = data;
                  Station.getCurrentStationbyId(user_profile.current_station, function(err, data){
                    if(err){ 
                      if(err) res.send(data);
                    }else{
                      user_profile.station = data;
                      res.render('profile', {
                        title: user_profile.username,
                        user_profile: user_profile,
                        user: req.user._doc
                      });
                    }
                  })
                }
              });
            }
          });
        }
      });
    }
  });
}