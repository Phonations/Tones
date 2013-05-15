var Friendship = require('../providers/friendship').Friendship
  ,User = require('../controller/user');

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

      friendship.save(function(err, friendship){
        fn(err, {"status":"sent"});
      });
    }
  });
}

exports.getFriendshipByUsers = function(user1_id, user2_id, fn){
     
  Friendship.findOne({$or : [
    {'user1._id':user1_id,'user2._id':user2_id}, 
    {'user2._id':user1_id,'user1._id':user2_id}
    ]}).exec(function(err, friendship){
    if(err) {
      fn(err, {"error":"[friendship] getFriendshipByUsers: An error has occurred"});
    }else{
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
    }
  });
}

exports.getFriendsByUser = function(user1_id, user2_id, fn){
  Friendship.find({$or : [
    {'user1._id':user1_id}, 
    {'user2._id':user1_id}
    ]}).exec(function(err, friendships){
    if(err) {
      fn(err, {"error":"[friendship] getFriendsByUser: An error has occurred"});
    }else{
      var friends_id = [];
      var type = [];
      for (var i = 0; i< friendships.length; i++){
        var friendship = friendships[i];

        // if both user accept the friendship we display it
        if(friendship.user1.accept&&friendship.user2.accept){
          if(friendship.user1._id == user1_id){
            friends_id.push(friendship.user2._id);
          }else{
            friends_id.push(friendship.user1._id);
          }
          type.push("friend");
        }

        if((friendship.user2._id == user2_id)&&(user1_id+'' == user2_id+'')&&(!friendship.user2.accept)){
          friends_id.push(friendship.user1._id);
          type.push("request");
        }

        if((friendship.user1._id == user2_id)&&(user1_id+'' == user2_id+'')&&(!friendship.user2.accept)){
          friends_id.push(friendship.user2._id);
          type.push("pending");
        }
      }

      User.getUsersByIds(friends_id, function(err, data){
        var friends = [];
        var requests = [];
        var pendings = [];
        for (var i = 0; i< data.length; i++){
          if(type[i] == "friend"){
            var friend = data[i];
            /*console.log("(user1_id+'' == user2_id+''):"+(user1_id+'' == user2_id+''));
            console.log("friend.currentStation:"+friend.current_station);
            if((user1_id+'' == user2_id+'')&&(friend.current_station!='')&&(friend.current_station)){
              Station.getCurrentStationbyId(friend.current_station, function(err, data){
                if(err)  fn(err, data);
                console.log('[view/profile] init:getCurrentStationbyId:'+data)
                friend.station = data;
              }
            }else{*/
              friends.push(friend);
            //}
          }
          if(type[i] == "request"){
            requests.push(data[i]);
          }
          if(type[i] == "pending"){
            pendings.push(data[i]);
          }
        }
        fn(err, friends, requests, pendings);
      })
    }
  })
}
