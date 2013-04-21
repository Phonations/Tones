var mongoose = require('mongoose')
  , utils = require('../utils');

var stationSchema = mongoose.Schema({
    name: String,
    id_user_create : String,
    users: Array,
    tones: Array,
    current: Number,
    nb_users: Number,
    nb_tones: Number
});
stationSchema.methods.addTone = function (tone_id, user_id, fn) {
	// we add the id of the tone in the station
	var tone={
	  'id':tone_id,
	  'user_id':user_id
	}
	this.tones.push(tone)

	// we remove a tone from the user that created it
	for(var i=0;i<this.users.length;i++){
	  var temp_id = this.users[i].id;
	  if(user_id+'' === temp_id+''){
	    if(this.users[i].nb_tones>0){
	      var user = {
	        "id":user_id,
	        "nb_tones":this.users[i].nb_tones-1
	      }
	      this.users.splice(i, 1, user);
	    }
	  }
	}
	this.save();
	fn();
}

stationSchema.methods.enter = function (user_id, fn) {
    for(var i=0;i<this.users.length;i++){
      var temp_id = this.users[i].id;
      if(user_id+'' === temp_id+''){
        return fn(); 
      }
    }
    var user = {
      "id":user_id,
      "nb_tones":this.nb_tones
    }
    this.users.push(user)
    this.save();
    fn();
}


stationSchema.methods.leave = function (user_id, fn) {
    for(var i=0;i<this.users.length;i++){
      var temp_id = this.users[i].id;
      if(user_id+'' === temp_id+''){
        this.users.splice(i, 1);
        this.save();
        return fn(); 
      }
    }
}


var Station = mongoose.model('Station', stationSchema);

exports.Station = Station;