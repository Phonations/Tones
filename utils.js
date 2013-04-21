
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