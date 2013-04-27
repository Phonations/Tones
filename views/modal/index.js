var config = require('../../config')
  , User = require('../../providers/user').User
  , utils = require('../../utils')
  , Station = require('../../providers/user').User;

exports.createstation = function (req, res){
  var station = new Station({
    'title':req.body.title,
    'url':req.body.title.replace(/\s+/g, '-').toLowerCase(),
    'id_user_create':req.user._doc._id+'',
    'nb_users':req.body.nb_users,
    'nb_tones':req.body.nb_tones,
    'current': 0
  });

  station.save(function(err, station){
    if(err) res.send({"error":1, "message": config.message.error_create_station});
    res.send({"error":0, "message":station._id});
  });
}