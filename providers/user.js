var mongoose = require('mongoose')
  , salt = 'x8FsqCnMURG/cBuuBjqJMN4Ll/akxifULmg7MljWGyTDHOdw1NHzG'
  , SHA2 = new (require('jshashes').SHA512)();

var userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
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

userSchema.methods.speak = function () {
  var greeting = this.username
    ? "Hi name is " + this.username
    : "I don't have a name"
  //console.log(greeting);
}


var User = mongoose.model('User', userSchema);
exports.User = User;