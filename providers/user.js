var mongoose = require('mongoose')
  , salt = 'x8FsqCnMURG/cBuuBjqJMN4Ll/akxifULmg7MljWGyTDHOdw1NHzG'
  , SHA2 = new (require('jshashes').SHA512)();

var userSchema = mongoose.Schema({
    fullname: String,
    username: String,
    email: String,
    url: String,
    password: String,
    current_station: String,
    friends:Array,
    twitter: {},
    facebook: {}
});


userSchema.methods.encodePassword = function (pass) { 
  if( typeof pass === 'string' && pass.length < 6 ) 
    return ''
  
  return SHA2.b64_hmac(pass, salt )
};

userSchema.methods.validPassword = function (password) {
  if (this.encodePassword(password) === this.password) {
    return true; 
  } else {
    return false;
  }
}

userSchema.methods.setCurrentStation = function (station_id, fn) {
  this.current_station = station_id;
  this.save();
  fn();
}

userSchema.methods.unsetCurrentStation = function (fn) {
  this.current_station = '';
  this.save();
  fn();
}

userSchema.methods.defaultReturnUrl = function (fn) {
  return '/'+this.username;
}

userSchema.methods.speak = function () {
  var greeting = this.username
    ? "Hi name is " + this.username
    : "I don't have a name"
  //console.log(greeting);
}


var User = mongoose.model('User', userSchema);
exports.User = User;