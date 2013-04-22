
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
  , Tone = require('./providers/tone').Tone;


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
    ,station;

  Station.findById(station_id).exec(function(err, data){
    station = data;
    socket.join(station_id);

    station.enter(user._id, function(){
      console.log('user '+user.username+' enter in room:'+station_id);
    });
  });


  socket.on('init', function(data) {
    console.log('welcome to '+user.username+' room:'+station_id);
  });


  socket.on('addItem', function(data) {
    var playnow = false;
    if(station.tones.length==0){
      playnow = true;
    }
    utils.createTone(data, function(tone_id){
      station.addTone(tone_id, user._id, function(){
        data._id = tone_id;
        console.log('tone '+data.title+' has been added in station '+station_id);
        io.sockets.in(station_id).emit('itemAdded', data);
        if(playnow){
          io.sockets.in(station_id).emit('playItem', data.id);
        }
      });
    })
  });

  socket.on('playerStopped', function  (tone_id) {
    io.sockets.in(station_id).emit('removeItem', tone_id);
    station.archiveTone(tone_id, function(){
      if(station.tones.length>0){
        Tone.findById(station.tones[0].id).exec(function(err, data){
          io.sockets.in(station_id).emit('playItem', data.id);
        });
      }
    });
  });
  /**
  * when a user disconnect
  */
  socket.on('disconnect', function  () {
    station.leave(user._id, function(){
      console.log('user '+user.username+' leave the room:'+station_id);
    });
  });
});