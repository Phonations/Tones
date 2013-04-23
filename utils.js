
var crypto = require('crypto')
  , Station = require('./providers/station').Station
  , Tone = require('./providers/tone').Tone
  , User = require('./providers/user').User;

/*
 * Restrict paths
 */

exports.restrict = function(req, res, next){
  if(req.isAuthenticated()) next();
  else res.redirect('/');
};

/*
 * Sort Case Insensitive
 */
/*
exports.encodePassword = function (pass) { 
	if( typeof pass === 'string' && pass.length < 6 ) 
		return ''
	
	return SHA2.b64_hmac(pass, salt )
};

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


exports.createUser = function (data, res, fn) { 
  User.find({'email':data.email}).exec(function(err, users){
    if(err) res.send({'error':'An error has occurred'});
    if(users.length>0){
      fn(users[0]);
    }else{
      var user = new User({
        username:data.username,
        email:data.email
      });
      user.password = user.encodePassword(data.password)
      user.save(function(err, user){
        if(err) res.send(config.message.valid);
        fn(user);
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
        console.log(tones._id+'-'+data[i]._id);
      }
      fn(tones);
    })
  })
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
tones : Array([
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
    //console.log(users.length+' users found');
    fn(users);
  })
}
/**
* function getUsers(data, fn)
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

exports.getUserInfo = function(user, station, fn){
  var user_id = user._id;
  for(var i=0;i<station.archives.users.length;i++){
    var temp_id = station.archives.users[i].id;
    if(user_id+'' === temp_id+''){
      user.nb_tones = station.archives.users[i].nb_tones;
      return fn(user); 
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
