var Tone = require('../providers/tone').Tone
  , User = require('./user')
  , Station = require('./station');

exports.getToneById = function(tone_id, fn){
}

exports.getTonesByUser = function(user, fn){
}

exports.getTonesByIds = function(tones_id, fn){
  console.log('[controller/tone] findListByIds: in');
  Tone.find().where('_id').in(tones_id).exec(function(err, tones){
    if(err) {
    	fn(err, {"error":"[tone] findListByIds: An error has occurred"});
    }else{
	    fn(err, tones);
	}
  })
}

exports.getTonesByStation = function(station, fn){
  if(station.tones.length>0){
	  var data = station.tones;
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
  		console.log('[controller/tone] findListByStation: out');
		fn(false, []);
	}
}

exports.findListByListItems = function(items, fn){
}

exports.findListByIds = function(tones_ids, fn){
}

exports.create = function(tone, fn){
}