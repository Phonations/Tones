var Tone = require('../providers/tone').Tone
	, ItemTone = require('../providers/tone').ItemTone
	, User = require('./user')
	, Station = require('./station');

/** getToneById
* params:
tone_id : String

* return:
tone: cf provider/station
*/

exports.getToneById = function(tone_id, fn){
  Tone.findOne({'id':tone_id}).exec(function(err, tone){
    if(err){
      fn(err, {"error":"[tone] getToneById: An error has occurred"});
    }else{
      fn(err, tone);
    }
  });
}

exports.getTonesByUser = function(user, fn){
	console.log('[controller/tone] getTonesByUser:'+user._id);
  ItemTone.find({'user_id':user._id}).exec(function(err, data){
    if(err) {
    	fn(err, {"error":"[tone] getTonesByUser: An error has occurred"});
    }else{
    	exports.getTonesByItemTones(data, fn);
	}
  });
}
/*
exports.getTonesByIds = function(tones_id, fn){
  Tone.find().where('_id').in(tones_id).exec(function(err, tones){
    if(err) {
    	fn(err, {"error":"[tone] findListByIds: An error has occurred"});
    }else{
	    fn(err, tones);
	}
  })
}*/

exports.getTonesByIds = function(tones_ids, fn){
  console.log("[tones] tones:"+tones_ids.length);
  Tone.find().where('id').in(tones_ids).exec(function(err, tones){
    if(err) {
    	fn(err, {"error":"[tone] createTone: An error has occurred"});
    }else{
    	fn(err, tones);
	 	}
	});
}

exports.getTonesByItemTones = function(itemtones, fn){
  if(itemtones.length){
	  var data = itemtones;
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

	  User.getUsersByIds(users_id, function(err, data){
	    if(err) {
	    	fn(err, data)
	    }else{
	    	var users = data;
		    tempusers_id = [];
		    for(var i = 0; i < users.length; i++){
		      var user_id = users[i]._id;
		      tempusers_id[user_id] = users[i].username;
		    }
		    exports.getTonesByIds(tones_id, function(err, data){
		      if(err) {
	    		fn(err, data)
		      }else{
		      	tones = data;
	  			data = itemtones;
			    for(var i = 0; i < tones.length; i++){
			      var user = {
			        "_id" : data[i].user_id,
			        "username" : tempusers_id[data[i].user_id]
			      }
			      tones[i].user = user;
			      tones[i]._id = data[i]._id;
			    }
			    fn(err, tones);
			  }
		    })
		}	
	  });
	}else{
		fn(false, []);
	}
}
exports.getTonesByStation = function(station, fn){
	exports.getTonesByItemTones(station.tones, fn);
}
exports.createTone = function(data, fn){
  Tone.find({'id':data.id}).exec(function(err, tones){
    if(err) {
    	fn(err, {"error":"[tone] createTone: An error has occurred"});
    }else{
	    if(tones.length > 0){
	      fn(tones[0].id);
	    }else{
	      var tone = new Tone({
	        id:data.id,
	        thumb:data.thumb,
	        title:data.title,
	        category:data.category,
	        duration:data.duration,
	      });

	      tone.save(function(err, tone){
			    if(err) {
			    	fn(err, {"error":"[tone] createTone: An error has occurred"});
			    }else{
		        fn(tone.id);
		   		}
	      });
	    }
		}
  });
}