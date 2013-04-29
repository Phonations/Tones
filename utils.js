
var crypto = require('crypto')
  , Station = require('./providers/station').Station
  , Tone = require('./providers/tone').Tone
  , ItemTone = require('./providers/tone').ItemTone
  , ToneLike = require('./providers/tone').ToneLike
  , User = require('./providers/user').User;

/*
 * Restrict paths
 */

exports.restrict = function(req, res, next){
  if(req.isAuthenticated()) next();
  else res.redirect('/');
};

/*
 * Log
 */

exports.trace = function (value){
  console.log(value);
}

/*
 * Sort Case Insensitive
 */

exports.caseInsensitiveSort = function (a, b) { 
   var ret = 0;

   a = a.toLowerCase();
   b = b.toLowerCase();

   if(a > b) ret = 1;
   if(a < b) ret = -1; 

   return ret;
};

/*
 * add user
 */


exports.createUser = function (data, fn) { 

  //first we double test if the username already exist
  User.find({'username':data.username}).exec(function(err, users){
    if(err) fn(true, null)
    if(users.length>0){
      fn(true, null)
    }else{
      // Hoorah the username doesn't exist
      // lets check if the email exist 
      User.find({'email':data.email}).exec(function(err, users){
        if(err) fn(true, null)
        if(users.length>0){
          fn(true, null)
        }else{
          // Hoorah the email doesn't exist
          var user = new User({
            fullname:data.fullname,
            username:data.username,
            email:data.email
          });
          user.password = user.encodePassword(data.password)
          user.save(function(err, user){
            if(err) fn(true, null)
            fn(false, user);
          });
        }
      });
    }
  });
};


/*
 * add tone
 */


exports.createTone = function (data, fn) { 
  Tone.find({'id':data.id}).exec(function(err, tones){
    if(err) res.send({'error':'An error has occurred'});
    if(tones.length>0){
      fn(tones[0]._id);
    }else{
      var tone = new Tone({
        id:data.id,
        thumb:data.thumb,
        title:data.title,
        category:data.category,
        duration:data.duration,
      });

      tone.save(function(err, tone){
        if(err) res.send(config.message.valid);
        fn(tone._id);
      });
    }
  });
};

/**
* function getTones(data, fn)
** parameters 
data  : Array([{_id:ObjectId, tone_id:ObjectId, user_id:ObjectId}, ...])
fn    : callback

** return 
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

 This function get all objects Tones from toneProvider and also get the associated username linked to the tone from the entry Array data
*/
exports.getTones = function(data, fn){
  var tones_id = [];
  var users_id = [];
  var tempusers_id = [];
  for(var i = 0; i < data.length; i++){
    tones_id.push(data[i].tone_id)
    var user_id = data[i].user_id;
    tempusers_id[user_id] = user_id;
  }

  for(user_id in tempusers_id){
    users_id.push(user_id)
  }

  User.find().where('_id').in(users_id).exec(function(err, users){
    if(err) res.send({'error':'An error has occurred'});
    tempusers_id = [];
    for(var i = 0; i < users.length; i++){
      var user_id = users[i]._id;
      tempusers_id[user_id] = users[i].username;
    }
    Tone.find().where('_id').in(tones_id).exec(function(err, tones){
      if(err) res.send({'error':'An error has occurred'});
      for(var i = 0; i < tones.length; i++){
        var user = {
          "_id" : data[i].user_id,
          "username" : tempusers_id[data[i].user_id]
        }
        tones[i].user = user;
        tones[i]._id = data[i]._id;
      }
      fn(tones);
    })
  })
}

exports.getTonesByUser = function(user_id, fn){
  ItemTone.find({'user_id':user_id}).exec(function(err, itemtones){
    exports.getTones(itemtones, fn);
  });
}

exports.likeTone = function (user_id, tone_id, fn) { 
  ToneLike.find({'user_id':user_id,'tone_id':tone_id}).exec(function(err, tonelikes){
    if(tonelikes.length>0){
      fn(err, tonelikes[0]._id);
    }else{
      var tonelike = new ToneLike({
        user_id:user_id,
        tone_id:tone_id
      });

      tonelike.save(function(err, tonelike){
        fn(err, tonelike._id);
      });
    }
  });
};
exports.unlikeTone = function (user_id, tone_id, fn) { 
  ToneLike.remove({'user_id':user_id,'tone_id':tone_id}).exec(function(err){
      fn(err);
  });
};

exports.getLikes = function (user_id, tones, fn) {
  var tones_ids = [];
  for (var i; i<tones.length;i++)
    tones_ids.push(tones[i]._id);
  ToneLike.find({'user_id':user_id}).where('tone_id').in(tones_ids).exec(function(err, tonelikes){
    for (var i; i<tones.length;i++){
      tones[i].like = false;
      for (var j; j<tonelikes.length;j++){
        if(tones[i]._id+'' == tonelikes[j].tone_id+''){
          tones[i].like = true;
        }
      }
    }
    fn(tones);
  });
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
exports.getMessages = function(data, fn){
  var users_id = [];
  var tempusers_id = [];
  for(var i = 0; i < data.length; i++){
    var user_id = data[i].user._id;
    tempusers_id[user_id] = user_id;
  }

  for(user_id in tempusers_id){
    users_id.push(user_id)
  }

  User.find().where('_id').in(users_id).exec(function(err, users){
    if(err) res.send({'error':'An error has occurred'});
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
    fn(data.reverse());
  })
}

/**
* function getUsers(data, fn)
** parameters 
data  : Array([{id:ObjectId, nb_tones:Number}, ...])
fn    : callback

** return 
users : Array([
  {
    _id:ObjectId,
    username:String
    email:String
    password:String
  }, ...
])  
*/

exports.getUsers = function(data, fn){
  var users_id = [];
  for(var i = 0; i < data.length; i++){
    users_id.push(data[i].id)
  }
  User.find().where('_id').in(users_id).exec(function(err, users){
    if(err) res.send({'error':'An error has occurred'});
    for(var i = 0; i < users.length; i++){
      users[i].password = '';
    }
    fn(users);
  })
}
/**
* function getUserInfo(user, station, fn)
** parameters 
user  : {
    _id:ObjectId,
    username:String
    email:String
    password:String
  }
station  : cf provider/station

** return 
user  : {
    _id:ObjectId,
    username:String
    email:String
    password:String
    nb_tones:Number
  }
*/

exports.getUserInfoInStation = function(user, station, fn){
  var user_id = user._id;
  if(station.archives){
    for(var i=0;i<station.archives.users.length;i++){
      var temp_id = station.archives.users[i].id;
      if(user_id+'' === temp_id+''){
        user.nb_tones = station.archives.users[i].nb_tones;
        return fn(user); 
      }
    }
  }
  for(var i=0;i<station.users.length;i++){
    var temp_id = station.users[i].id;
    if(user_id+'' === temp_id+''){
      user.nb_tones = station.users[i].nb_tones;
      return fn(user); 
    }
  }
  user.nb_tones = station.nb_tones;
  return fn(user); 
}

/**
* function getStation(req, res, fn)
** parameters 
req.params.id  : station_id
req.user._doc : user

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
exports.getStationById = function(station_id, fn){
  Station.findById(station_id).exec(function(err, station){
      if(err) res.send({'error':'An error has occurred'});
      fn(station);
  });
}

exports.getStationByName = function(username, station_title, fn){
  User.find({'username':username}).exec(function(err, users){
    Station.find({'url':station_title, 'id_user_create':users[0]._id}).exec(function(err, stations){
      station = stations[0];
      fn(station);
    });
  });
}

exports.getStation = function(req, res, station, fn){
  // first we get the update the user info in the station
  exports.getUserInfoInStation(req.user._doc, station, function(user){
    // second we get the detail list of users
    exports.getUsers(station.users, function(users){
      station.users = users;
      // third we get the detail list of tones
      exports.getTones(station.tones, function(tones){
        station.tones = tones;
        // fourth we get the detail list of messages
        exports.getMessages(station.messages, function(messages){
          fn(station, user);
        });
      });
    });
  });
}
/*
exports.getStation2 = function(req, res, fn){
  User.find({'username':req.params.username}).exec(function(err, users){
    if(err) res.send({'error':'1. An error has occurred'});
    Station.find({'url':req.params.title, 'id_user_create':users[0]._id}).exec(function(err, stations){
      if(err) res.send({'error':'An error has occurred'});
      // first we get the update the user info in the station
      station = stations[0];
      console.log('station:'+station.title)
      exports.getUserInfoInStation(req.user._doc, station, function(user){
        // second we get the detail list of users
        exports.getUsers(station.users, function(users){
          station.users = users;
          // third we get the detail list of tones
          exports.getTones(station.tones, function(tones){
            station.tones = tones;
            // fourth we get the detail list of messages
            exports.getMessages(station.messages, function(messages){
              fn(station, user);
            });
          });
        });
      });
    });
  });
}*/

/**
* function getStationDetails(station_id, req, res, fn)
** parameters 
req.params.id  : station_id
req.user._doc : user

** return 
*/
exports.getStationDetails = function(station_id, req, res, fn){
  Station.find({'_id':station_id}).exec(function(err, stations){
    if(err){
      fn('');
    }else{
      if(stations.length>0){
        // user is in a station
        var station = stations[0];
        // if the is track in the playlist
        if(station.tones.length>0){
          // we need the title of the current track
          Tone.find({'_id':station.tones[0].tone_id}).exec(function(err, tones){
            if(tones.length>0){
              station.tones[0] = tones[0];
              console.log('Currently watching "'+station.tones[0].title+'" on '+station.title+' station with '+station.users.length+' others');
              fn(station);
            }else{
              console.log('is on '+station.title+' station with no tracks');
              fn(station);
            }
          });
        }else{
          console.log('is on '+station.title+' station with no tracks');
          fn(station);
        }
      }else{
        console.log('has no current Station');
        fn('');
      }
    }
  });
}
