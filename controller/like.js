var ToneLike = require('../providers/tone').ToneLike
, Tone = require('./tone');

exports.addLikesInTonesByUsers = function(user, tones, fn){
  var tones_ids = [];
  for (var i=0; i<tones.length;i++){
    tones_ids.push(tones[i].id+'');
  }
  ToneLike.find({'user_id':user._id}).where('tone_id').in(tones_ids).exec(function(err, tonelikes){
  	if(err){
  	  fn(err, {"error":"[like] getLikesByUsersAndItemTones: An error has occurred"});
  	}else{
	    for (var i=0; i<tones.length;i++){
	      tones[i].like = false;
	      for (var j=0; j<tonelikes.length;j++){
	        if(tones[i].id+'' == tonelikes[j].tone_id+''){
	          tones[i].like = true;
	        }
	      }
	    }
	    fn(err, tones);
  	}
  });
}

exports.getLikesByUser = function (user, fn) {
  ToneLike.find({'user_id':user._id}).exec(function(err, tonelikes){
    if(err){
      fn(err, {"error":"[like] getLikesByUsersAndItemTones: An error has occurred"});
    }else{
      var tones_ids = [];
      for (var i=0; i<tonelikes.length;i++){
        tones_ids.push(tonelikes[i].tone_id);
      }
      Tone.getTonesByIds(tones_ids, function(err, tones){
        for (var i=0; i<tones.length;i++){
          tones[i].like = true;
        }
        fn(err, tones);
      });
    }
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