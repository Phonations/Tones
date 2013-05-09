var Friendship = require('../providers/friendship').Friendship

exports.sendFriendship = function(user1_id, user2_id, fn){
  console.log('[controller/Friendship] sendFriendship:'+user1_id+','+user2_id);
  Friendship.find({$or : [{'user1._id':user1_id,'user2._id':user2_id}, {'user2._id':user1_id,'user1._id':user2_id}]}).exec(function(err, friendship){
    if(friendship.length>0){
      console.log('[controller/Friendship] Friendship friendship.length>0');
      fn(err, tonelikes[0]._id);
    }else{
    	var user1 = {
    		_id:user1_id,
    		accept:true
    	};

    	var user2 = {
    		_id:user2_id,
    		accept:false
    	};
      var friendship = new Friendship({
        user1:user1,
        user2:user2
      });

      console.log('[controller/Friendship] Friendship save:'+user_id+','+tone_id);
      friendship.save(function(err, friendship){
        fn(err, friendship._id);
      });
    }
  });
}

exports.findListFriendsByUser = function(user_id, fn){

}

exports.findListRequestByUser = function(tone_id, fn){

}

exports.acceptFriendship = function(friendship_id, user, fn){

}

exports.create = function(like, fn){
}