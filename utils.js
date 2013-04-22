
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
      console.log('user found:'+users[0].username);
      fn(users[0]);
    }else{
      var user = new User({
        username:data.username,
        email:data.email
      });
      user.password = user.encodePassword(data.password)
      user.save(function(err, user){
        if(err) res.send(config.message.valid);
        console.log('user save:'+user);
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
      console.log('tone found:'+tones[0]._id);
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
        console.log('tone save:'+tone._id);
        fn(tone._id);
      });
    }
  });
};

exports.getTones = function(data, fn){
  var tones_id = [];
  for(var i = 0; i < data.length; i++){
    tones_id.push(data[i].id)
    console.log('data[i].id:'+data[i].id);
  }
  Tone.find().where('_id').in(tones_id).exec(function(err, tones){
    if(err) res.send({'error':'An error has occurred'});
    console.log(tones.length+' tones found');
    fn(tones);
  })
}

exports.getUsers = function(data, fn){
  var users_id = [];
  for(var i = 0; i < data.length; i++){
    users_id.push(data[i].id)
  }
  User.find().where('_id').in(users_id).exec(function(err, users){
    if(err) res.send({'error':'An error has occurred'});
    console.log(users.length+' users found');
    fn(users);
  })
}