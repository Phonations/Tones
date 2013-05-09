var mongoose = require('mongoose');

var friendshipSchema = mongoose.Schema({
    user1: Object,
    user2: Object,
    dateCreate:Number
});


var Friendship = mongoose.model('Friendship', friendshipSchema);
exports.Friendship = Friendship;