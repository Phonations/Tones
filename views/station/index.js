var config = require('../../config')
  , User = require('../../providers/user').User
  , utils = require('../../utils')
  , Station = require('../../providers/station').Station;

exports.trace = function (value){
  utils.trace('[view-station] '+value);
}

exports.init = function (req, res){
  utils.getStationByName(req.params.username, req.params.title, function(station){
    exports.trace('station._title:'+station._title);
    utils.getStation(req, res, station, function(station, user){
      exports.trace('got the station');
      utils.getLikes(user._id, station.tones, function(tones){
        exports.trace('got the likes');
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