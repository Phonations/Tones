
/*
 * Module dependencies
*/

var parent = module.parent.exports 
  , app = parent.app
  , server = parent.server
  , express = require('express')
  , sessionStore = parent.sessionStore
  , sio = require('socket.io')
  , parseCookies = require('connect').utils.parseSignedCookies
  , cookie = require('cookie')
  , config = require('./config.json')
  , User = require('./controller/user')
  , Station = require('./controller/station')
  , Tone = require('./controller/tone')
  , ItemTone = require('./controller/itemtone');


var io = sio.listen(server);
io.set('authorization', function (hsData, accept) {
  console.log(hsData.headers.cookie);
  if(hsData.headers.cookie) {
    var cookies = parseCookies(cookie.parse(hsData.headers.cookie), config.session.secret)
      , sid = cookies['tones'];
    
    sessionStore.load(sid, function(err, session) {
      if(err || !session) {
        return accept('Error retrieving session!', false);
      }
      
      var referer = hsData.headers.referer.split('/');
      if(referer[referer.length-1] == ""){
        referer.pop();
      }
      station_url = referer[referer.length-1];
      user_url = referer[referer.length-3];

      Station.getStationByUrl(user_url, station_url, function(err, station){
        hsData.tones = {
          user: session.passport.user._doc,
          station: station._id
        };
        return accept(null, true);
      });
    
    });
  } else {
    return accept('No cookie transmitted.', false);
  }
});

io.sockets.on('connection', function (socket) {

  var hs = socket.handshake
    , user = hs.tones.user
    , station_id = hs.tones.station
    , now = new Date()

  socket.join(station_id);


  Station.getStationById(station_id, function(err, station){
    console.log('socket : getStationById '+station.title);
    User.getUserById(user._id, function(err, currentuser){
      io.sockets.in(station_id).emit('newUser', currentuser);
      console.log('socket : getUserById '+currentuser.username);
      currentuser.setCurrentStation(station._id, function(){
        station.enter(user._id, function(){
          console.log('welcome to '+user.username+' room:'+station_id);
        });
      });
    });
  });
  /*socket.on('init', function(data) {
    Station.getStationById(station_id, function(err, station){
      console.log('socket : getStationById '+station.title);
      User.getUserById(user._id, function(err, currentuser){
        console.log('socket : getUserById '+currentuser.name);
        currentuser.setCurrentStation(station_id, function(){
          station.enter(user._id, function(){
            console.log('welcome to '+user.username+' room:'+station_id);
          });
        });
      });
    });
  });*/


  socket.on('addItem', function(data) {
    Tone.createTone(data, function(tone_id){
      console.log('tone '+tone_id+' has been createTone');
      Station.getStationById(station_id, function(err, station){
        ItemTone.createItemTone({'tone_id':tone_id,'user_id':user._id,'station_id':station._id}, function(err, doc){
          if(err){
            console.log(doc.error);
          }else{
            var itemTone = doc;
            station.addItemTone(itemTone, function(){
              data._id = itemTone._id;
              console.log('tone '+data.title+' has been added in station '+station_id);
              data.user = user;
              io.sockets.in(station_id).emit('newItem', data);
            });
          }
        });
      });
    })
  });

  socket.on('playerStopped', function  (tone_id) {
    console.log('playerStopped:'+tone_id);
    Station.getStationById(station_id, function(err, station){
      station.archiveItemTone(tone_id, function(tone){
        io.sockets.in(station_id).emit('removeItem', tone);
        console.log('playerStopped station.tones.length:'+station.tones.length);
        if(station.tones.length>0){
          Tone.getToneById(station.tones[0].tone_id, function(err, data){
            io.sockets.in(station_id).emit('playItem', data.id);
          });
        }
      });
    });
  });


  socket.on('sendMessage', function  (data) {
    var user_message = {
       '_id': user._id
    }
    data.user = user_message;
    Station.getStationById(station_id, function(err, station){
      station.addMessage(data, function(){
        data.user.username = user.username;
        io.sockets.in(station_id).emit('newMessage', data);
      });
    });
  });

  /**
  * when a user disconnect
  */

  socket.on('disconnect', function  () {
    Station.getStationById(station_id, function(err, station){
      User.getUserById(user._id, function(err, currentuser){
        currentuser.unsetCurrentStation(function(){
          station.leave(user._id, function(){
            //console.log('user '+user.username+' leave the room:'+station_id);
            io.sockets.in(station_id).emit('removeUser', user);
          });
        });
      });
    });
  });
});