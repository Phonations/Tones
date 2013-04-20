var mongoose = require('mongoose')
  , utils = require('../utils');

var userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
});

userSchema.methods.validPassword = function (password) {
  if (utils.encodePassword(password) === this.password) {
    return true; 
  } else {
    return false;
  }
}

userSchema.methods.speak = function () {
  var greeting = this.username
    ? "Hi name is " + this.username
    : "I don't have a name"
  console.log(greeting);
}


var User = mongoose.model('User', userSchema);
exports.User = User;