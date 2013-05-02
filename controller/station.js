
var Station = require('../providers/station').Station
  , User = require('./user')
  , Tone = require('./tone')
  , Message = require('./message');

/** getStationById
* params:
station_id : String

* return:
station: cf provider/station
*/

exports.getStationById = function(station_id, fn){
  Station.findById(station_id).exec(function(err, station){
    if(err){
      fn(err, {"error":"[station] getStationById: An error has occurred"});
    }else{
      fn(err, station);
    }
  });
}

/** getStationByUrl
* user when the client call the url /:user/s/:station
* params:
user_url : String
station_url : String

* return:
station: cf provider/station
*/

exports.getStationByUrl = function(user_url, station_url, fn){
  User.getUserByUrl(user_url, function(err, data){
    if(err){ 
      fn(err, data);
    }else{  
      user = data;
      console.log('[controller/station] getStationByUrl: got the user '+user.username);
      Station.find({'url':station_url, 'id_user_create':user._id}).exec(function(err, stations){
        console.log('[controller/station] getStationByUrl: got the station '+station_url+' stations.length='+stations.length);
        fn(err, stations[0]);
      });
    }
  });
}



/**
* function getInfosStation(user, station, fn)
** parameters 
user : object
station : object

** return 
station  : {
    title: String,
    id_user_create : String,
    users : Array([
      {
        _id:ObjectId,
        username:String
        email:String
        password:String
      }, ...
    ]), 
    tones : Array([
      {
        _id:ObjectId,
        id:String,
        thumb:String,
        title:String,
        category:String,
        duration:String,
        User : {
          id:ObjectId, 
          username:String
        }
      }, ...
    ])  
    archives: {
      users: Array,
      tones: Array
    },
    messages : Array([
      {
        message:String,
        User : {
          id:ObjectId, 
          username:String
        }
      }, ...
    ])
    current: Number,
    nb_users: Number,
    nb_tones: Number
  }

user : {
    fullname: String,
    username: String,
    email: String,
    nm_tones: Number
};

*/

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


/** getStationByUser
* user when the client call the url /:user/s/:station
* params:
user_url : String
station_url : String

* return:
station: cf provider/station
*/


exports.getStationsByUser = function(user, fn){
  console.log('[stations] getStationsByUser:');
  Station.find({'id_user_create':user._id}).exec(function(err, stations){
    if(err) {
      fn(err, {"error":"[stations] getStationsByUser: An error has occurred"});
    }else{
      fn(err, stations);
    }
  });
}
exports.getCurrentStationbyId = function(station_id, fn){
  if((station_id=="")||(!station_id)){
    //there is no valid id 
    fn(false, '');
  }else{
    exports.getStationById(station_id, function(err, data){
      if(err){
        fn(err, data);
      }else{
        if(!data){
          //station doesn't exist anymore 
          fn(false, '');
        }else{
          var station = data;
          if(station){
            // user is in a station
            if(station.tones.length>0){
              // if the is track in the playlist
              if(station.tones.length>0){
                // we need the title of the current track
                Tone.getToneById(station.tones[0].tone_id, function(err, data){
                  if(err){
                    fn(err, data);
                  }else{
                    if(data){
                      station.tones[0] = data;
                    }
                    fn(err, station);
                  }
                });
              }else{
                // station has no tracks
                fn(err, station);
              }
            }else{
              // user has no current Station
              fn(err, '');
            }
          }
        }
      }
    })
  }
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
  if(station.messages){    
    var data = station.messages,
    users_id = [],
    tempusers_id = [];
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
/**
*
*/
exports.createStation = function(data, user, fn){
  console.log('url:'+url);
  var url = data.title.replace(/\s+/g, '-');
  console.log('url:'+url);
  url = url.replace(/[$/:-?{-~!/"#\'^`\[\]]+/g, '').toLowerCase();
  console.log('url:'+url);
  var station = new Station({
    'title':data.title,
    'url':url,
    'id_user_create':user._id+'',
    'nb_users':data.nb_users,
    'nb_tones':data.nb_tones,
    'current': 0
  });

  station.save(function(err, station){
    if(err) {
      fn(err, {"error":"[stations] createStation: An error has occurred"});
    }else{
      fn(err, station);
    }
  });
}




