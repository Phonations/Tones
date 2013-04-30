var User = require('../providers/user').User;

exports.getUserById = function(station_id, fn){
}

exports.getUserByUrl = function(user_url, fn){
  User.find({'username':user_url}).exec(function(err, users){
    if(err) {
    	fn(err, {"error":"[user] getUserByUrl: An error has occurred"});
    }else{
  		fn(err, users[0]);
  	}
  });
}

exports.getInfosUserInStation = function(user, station, fn){
  var user_id = user._id;
  if(station.archives){
    for(var i=0;i<station.archives.users.length;i++){
      var temp_id = station.archives.users[i].id;
      if(user_id+'' === temp_id+''){
        user.nb_tones = station.archives.users[i].nb_tones;
        return fn(false, user); 
      }
    }
  }
  if(station.users){
	  for(var i=0;i<station.users.length;i++){
	    var temp_id = station.users[i].id;
	    if(user_id+'' === temp_id+''){
	      user.nb_tones = station.users[i].nb_tones;
	      return fn(false, user); 
	    }
	  }
  }
  user.nb_tones = station.nb_tones;
  return fn(false, user); 
}

exports.getUsersByIds = function(users_id, fn){
  console.log('[controller/user] findListByIds: in');
  User.find().where('_id').in(users_id).exec(function(err, users){
    if(err) {
    	fn(err, {"error":"[user] findListByIds: An error has occurred"});
    }else{
	  	for(var i = 0; i < users.length; i++){
	      users[i].password = '';
	    }
	    fn(err, users);
	}
  })
}


exports.getUsersByStation = function(station, fn){
  if(station.users){
	  var data = station.users;
	  var users_id = [];
	  for(var i = 0; i < data.length; i++){
	    users_id.push(data[i].id)
	  }
	  exports.getUsersByIds(users_id, fn);
  }else{
  	fn(false, []);
  }
}

exports.create = function(user, fn){

}