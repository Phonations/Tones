
var crypto = require('crypto')
  , salt = 'x8FsqCnMURG/cBuuBjqJMN4Ll/akxifULmg7MljWGyTDHOdw1NHzG'
  , SHA2 = new (require('jshashes').SHA512)()
  , User = require('./providers/user').User
  , Station = require('./providers/station').Station
  , Tone = require('./providers/tone').Tone;

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
 * add tone
 */


exports.createTone = function (data, station_id, user_id, fn) { 
  Tone.find({'id':data.id}).exec(function(err, tones){
    if(err) res.send({'error':'An error has occurred'});
    if(tones.length>0){
      console.log('tone found:'+tones[0].id);
      exports.addToneInStation(tones[0]._id, station_id, user_id, fn);
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
        console.log('tone save:'+tone.id);
        exports.addToneInStation(tone._id, station_id, user_id, fn);
      });
    }
  });
};


exports.addToneInStation = function (tone_id, station_id, user_id, fn) { 
  console.log('add tone '+tone_id+' in station '+station_id);
  Station.findById(station_id).exec(function(err, station){
    // we add the id of the tone in the station
    var tone={
      'id':tone_id,
      'user_id':user_id
    }
    station.tones.push(tone)

    // we remove a tone from the user that created it
    for(var i=0;i<station.users.length;i++){
      var temp_id = station.users[i].id;
      if(user_id+'' === temp_id+''){
        if(station.users[i].nb_tones>0){
          var user = {
            "id":user_id,
            "nb_tones":station.users[i].nb_tones-1
          }
          station.users.splice(i, 1, user);
        }
      }
    }
    station.save();
    fn();
  });
};

/*
* When the user enter in a station
*/

exports.enterStation = function (user_id, station_id, fn) { 
  Station.findById(station_id).exec(function(err, station){
    for(var i=0;i<station.users.length;i++){
      var temp_id = station.users[i].id;
      if(user_id+'' === temp_id+''){
        return fn(); 
      }
    }
    var user = {
      "id":user_id,
      "nb_tones":station.nb_tones
    }
    station.users.push(user)
    station.save();
    fn();
  });
};

/*
* When the user leave in a station
*/

exports.leaveStation = function (user_id, station_id, fn) { 
  Station.findById(station_id).exec(function(err, station){
    for(var i=0;i<station.users.length;i++){
      var temp_id = station.users[i].id;
      if(user_id+'' === temp_id+''){
        station.users.splice(i, 1);
        station.save();
        return fn(); 
      }
    }
  });
};
