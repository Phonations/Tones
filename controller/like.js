var ToneLike = require('../providers/tone').ToneLike

exports.addLikesInTonesByUsers = function(user, tones, fn){
  var tones_ids = [];
  for (var i; i<tones.length;i++)
    tones_ids.push(tones[i]._id);
  ToneLike.find({'user_id':user._id}).where('tone_id').in(tones_ids).exec(function(err, tonelikes){
  	if(err){
  	  fn(err, {"error":"[like] getLikesByUsersAndItemTones: An error has occurred"});
  	}else{
	    for (var i; i<tones.length;i++){
	      tones[i].like = false;
	      for (var j; j<tonelikes.length;j++){
	        if(tones[i]._id+'' == tonelikes[j].tone_id+''){
	          tones[i].like = true;
	        }
	      }
	    }
	    fn(err, tones);
  	}
  });
}