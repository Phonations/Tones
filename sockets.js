
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
  , utils = require('./utils')
  , User = require('./providers/user').User
  , Station = require('./providers/station').Station
  , Tone = require('./providers/tone').Tone
  , ItemTone = require('./providers/tone').ItemTone;


var io = sio.listen(server);
io.set('authorization', function (hsData, accept) {
  //console.log(hsData.headers.cookie);
  if(hsData.headers.cookie) {
    var cookies = parseCookies(cookie.parse(hsData.headers.cookie), config.session.secret)
      , sid = cookies['tones'];
    
    sessionStore.load(sid, function(err, session) {
      if(err || !session) {
        return accept('Error retrieving session!', false);
      }

      hsData.tones = {
        user: session.passport.user._doc,
        station: /\/(?:([^\/]+?))\/?$/g.exec(hsData.headers.referer)[1]
      };

      return accept(null, true);
    
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
  io.sockets.in(station_id).emit('newUser', user);
  Station.findById(station_id).exec(function(err, station){
    station.enter(user._id, function(){});
  });


  socket.on('init', function(data) {
    //console.log('welcome to '+user.username+' room:'+station_id);
  });


  socket.on('addItem', function(data) {
    utils.createTone(data, function(tone_id){
      console.log('tone '+tone_id+' has been createTone');
      Station.findById(station_id).exec(function(err, station){
        var itemTone = new ItemTone({
          'tone_id':tone_id,
          'user_id':user._id
        });
        itemTone.save(function(err, itemTone){
          if(err) console.log("something when wrong the ItemTone didn't save");
          station.addItemTone(itemTone, function(){
            data._id = itemTone._id;
            console.log('tone '+data.title+' has been added in station '+station_id);
            data.user = user;
            io.sockets.in(station_id).emit('newItem', data);
          });
        });
      });
    })
  });

  socket.on('playerStopped', function  (tone_id) {
    console.log('playerStopped:'+tone_id);
    Station.findById(station_id).exec(function(err, station){
      station.archiveItemTone(tone_id, function(tone){
        io.sockets.in(station_id).emit('removeItem', tone);
        console.log('playerStopped station.tones.length:'+station.tones.length);
        if(station.tones.length>0){
          Tone.findById(station.tones[0].tone_id).exec(function(err, data){
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
    Station.findById(station_id).exec(function(err, station){
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
    Station.findById(station_id).exec(function(err, station){
      station.leave(user._id, function(){
        //console.log('user '+user.username+' leave the room:'+station_id);
        io.sockets.in(station_id).emit('removeUser', user);
      });
    });
  });
});