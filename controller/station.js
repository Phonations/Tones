
var Station = require('../providers/station').Station
  , User = require('./user')
  , Tone = require('./tone')
  , Message = require('./message');

exports.getStationById = function(station_id, fn){
  Station.findById(station_id).exec(function(err, station){
      fn(err, station);
  });
}

exports.getStationByUrl = function(user_url, station_url, fn){
  User.getUserByUrl(user_url, function(err, data){
    if(err){ 
      fn(err, data);
    }else{  
      user = data;
      Station.find({'url':station_url, 'id_user_create':user._id}).exec(function(err, stations){
        fn(err, stations[0]);
      });
    }
  });
}

exports.getInfosStation = function(user, station, fn){
  // first we get the update the user info in the station
  User.getInfosUserInStation(user, station, function(err, data){
    if(err){ 
      fn(err, data);
    }else{  
      user = data; 
      // second we get the detail list of users
      User.getUsersByStation(station, function(err, data){
        if(err){ 
          fn(err, data);
        }else{  
          station.users = data;
          // third we get the detail list of tones
          Tone.getTonesByStation(station, function(err, data){
            if(err){ 
              fn(err, data);
            }else{  
              station.tones = data;
              // fourth we get the detail list of messages
              exports.getMessages(station, function(err, messages){
                if(err){ 
                  fn(err, data);
                }else{  
                  station.messages = messages;
                  fn(err, {"station":station, "user":user});
                }
              });
            }
          });
        }
      });
    }
  });
}

exports.findListByUser = function(user, fn){
}

exports.findCurrentByUser = function(user, fn){
}
/**
* function getMessages(data, fn)
** parameters 
data  : Array([
  {
    message:String, 
    user:
    {
      _id:ObjectId
    }
  }, ...])
fn    : callback

** return 
messages : Array([
  {
    message:String,
    User : {
      id:ObjectId, 
      username:String
    }
  }, ...
])  
*/
exports.getMessages = function(station, fn){
  if(station.messages.length>0){
    var data = station.messages;
    var users_id = [];
    var tempusers_id = [];
    for(var i = 0; i < data.length; i++){
      var user_id = data[i].user._id;
      tempusers_id[user_id] = user_id;
    }

    for(user_id in tempusers_id){
      users_id.push(user_id)
    }

    User.getUsersByIds(users_id, function(err, data){
      if(err){ 
        fn(err, data);
      }else{  
        var users = data;
        var data = station.messages;
        tempusers_id = [];
        for(var i = 0; i < users.length; i++){
          var user_id = users[i]._id;
          tempusers_id[user_id] = users[i].username;
        }

        for(var i = 0; i < data.length; i++){
          var user = {
            "_id" : data[i].user_id,
            "username" : tempusers_id[data[i].user._id]
          }
          data[i].user = user;
        }
        fn(false, data.reverse());
      }
    })
  }else{
    fn(false, [])
  }
}

exports.create = function(station, fn){
}