var Friendship = require('../providers/friendship').Friendship

exports.sendFriendship = function(user1_id, user2_id, fn){
  Friendship.findOne({$or : [
    {'user1._id':user1_id,'user2._id':user2_id}, 
    {'user2._id':user1_id,'user1._id':user2_id}]
  }).exec(function(err, friendship){
    if(friendship){
      if(friendship.user2._id == user1_id){
        friendship.user2.accept = true;
        friendship.save(function(){
          fn(err, {"status":"friends"});
        });
      }else{
        fn(err, {"status":"sent"});
      }
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

      console.log('[controller/Friendship] Friendship save:'+user1_id+','+user2_id);
      friendship.save(function(err, friendship){
        fn(err, {"status":"sent"});
      });
    }
  });
}

exports.getFriendshipByUsers = function(user1_id, user2_id, fn){
  //console.log('[controller/Friendship] getFriendshipByUsers:'+user1_id+','+user2_id);
  console.log('db.friendships.find({$or:[{"user1._id:"'+user1_id+',"user2._id":'+user2_id+'},{"user1._id:"'+user2_id+',"user2._id":'+user1_id+'}]})');
     
  Friendship.findOne({$or : [
    {'user1._id':user1_id,'user2._id':user2_id}, 
    {'user2._id':user1_id,'user1._id':user2_id}
    ]}).exec(function(err, friendship){
    if(friendship){
      if(friendship.user2.accept){
        friendship.status = "friends";
      }else{
        if(friendship.user1._id == user1_id){
          friendship.status = "sent";
        }
        if(friendship.user1._id == user2_id){
          friendship.status = "recieve";
        }
      }
    }
    fn(err, friendship);
  });
  //  Friendship.find({$or : [{'user1._id':user1_id,'user2._id':user2_id}, {'user2._id':user1_id,'user1._id':user2_id}]}).exec(function(err, friendship){
}

exports.findListRequestByUser = function(tone_id, fn){

}

exports.acceptFriendship = function(friendship_id, user, fn){

}

exports.create = function(like, fn){
}