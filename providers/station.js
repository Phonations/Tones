var mongoose = require('mongoose')
  , utils = require('../utils');

var stationSchema = mongoose.Schema({
    title: String,
    url: String,
    id_user_create : String,
    users: Array,
    tones: Array,
    archives: {
      users: Array,
      tones: Array
    },
    messages: Array,
    current: Number,
    nb_users: Number,
    nb_tones: Number
});

/*stationSchema.methods.addTone = function (tone_id, user_id, fn) {
	// we add the id of the tone in the station
	var tone={
	  '_id':tone_id,
	  'user_id':user_id
	}
	this.tones.push(tone);
  this.save();
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
}*/

stationSchema.methods.addItemTone = function (itemTone, fn) {
  // we add the id of the tone in the station
  var iTones = {
    '_id':itemTone._id,
    'user_id':itemTone.user_id,
    'tone_id':itemTone.tone_id
  }
  this.tones.push(iTones);
  this.save();
  // we remove a tone from the user that created it
  for(var i=0;i<this.users.length;i++){
    var temp_id = this.users[i].id;
    if(itemTone.user_id+'' === temp_id+''){
      if(this.users[i].nb_tones>0){
        var user = {
          "id":itemTone.user_id,
          "nb_tones":this.users[i].nb_tones-1
        }
        this.users.splice(i, 1, user);
      }
    }
  }
  this.save();
  fn();
}


stationSchema.methods.addMessage = function (message, fn) {
  this.messages.push(message);
  this.save();
  fn();
}

stationSchema.methods.enter = function (user_id, fn) {
  // first we check if the user already exist in users
  for(var i=0;i<this.users.length;i++){
    var temp_id = this.users[i].id;
    if(user_id+'' === temp_id+''){
      // if he exist we can return
      return fn(); 
    }
  }

  var user = {
    "id":user_id,
    "nb_tones":this.nb_tones
  }
  // second we check if the user already exist in archives.users
  for(var i=0;i<this.archives.users.length;i++){
    var temp_id = this.archives.users[i].id;
    if(user_id+'' === temp_id+''){
      // if he exist we get the user in archives.users
      user = this.archives.users[i];
      // we remove the user from archives.users
      this.archives.users.splice(i, 1);
      this.save();
    }
  }

  this.users.push(user)
  this.save();
  fn();
}


stationSchema.methods.leave = function (user_id, fn) {
    for(var i=0;i<this.users.length;i++){
      var temp_id = this.users[i].id;
      if(user_id+'' === temp_id+''){
        // we push the user in archives.users
        var user = this.users[i];
        this.archives.users.push(user);
        this.save();
        // we remove the user from users
        this.users.splice(i, 1);
        this.save();
        return fn(); 
      }
    }
}

stationSchema.methods.archiveItemTone = function (tone_id, fn){
    for(var i=0;i<this.tones.length;i++){
      var temp_id = this.tones[i]._id;
      if(tone_id+'' === temp_id+''){
        var tone = this.tones[i];
        this.archives.tones.push(tone);
        this.tones.splice(i, 1);
        this.save();
        return fn(tone); 
      }
    }
}


var Station = mongoose.model('Station', stationSchema);

exports.Station = Station;