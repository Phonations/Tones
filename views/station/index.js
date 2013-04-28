var config = require('../../config')
  , User = require('../../providers/user').User
  , utils = require('../../utils')
  , Station = require('../../providers/station').Station;

exports.init = function (req, res){
  utils.getStationByName(req.params.username, req.params.title, function(station){
    utils.getStation(req, res, station, function(station, user){
      utils.getLikes(user._id, station.tones, function(tones){
        station.tones = tones;
        res.render('station', {
          title: 'station - '+station.title,
          user: user,
          station: station
        });
      });
    });
  });
}