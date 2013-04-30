var config = require('../../config')
  , User = require('../../providers/user').User
  , utils = require('../../utils')
  , Station = require('../../controller/station');

exports.init = function (req, res){
  Station.getStationByUrl(req.params.username, req.params.title, function(err, station){
    console.log('[view/station] init: got the station');
    Station.getInfosStation(req.user._doc, station, function(err, data){
      if(err)res.send(data.error);
      station = data.station;
      user = data.user;
      console.log('[view/station] init: got the info station');
      utils.getLikes(user._id, station.tones, function(tones){
        console.log('[view/station] init: got the likes');
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