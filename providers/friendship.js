var mongoose = require('mongoose');

var friendshipSchema = mongoose.Schema({
	user1: {
		_id:String,
		accept:Boolean
	},
	user2: {
		_id:String,
		accept:Boolean
	},
	dateCreate:Number
});


var Friendship = mongoose.model('Friendship', friendshipSchema);
exports.Friendship = Friendship;