

/*var atts = { id: "ytcontroller1" };
swfobject.embedSWF("http://www.youtube.com/v/wycjnCCgUes?enablejsapi=1&playerapiid=ytcontroller1&version=3",
                       "ytcontroller1", "480", "270", "8", null, null, params, atts);

var atts = { id: "ytcontroller2" };
swfobject.embedSWF("http://www.youtube.com/v/wycjnCCgUes?enablejsapi=1&playerapiid=ytcontroller2&version=3",
                       "ytcontroller2", "480", "270", "8", null, null, params, atts);*/


var socket = io.connect();
var listusers = []; 
var idUSER = s4()+s4()+s4()+s4();
var nbSongsMax = 8;

$(document).ready(function(){
	$('#ytapiplayer').tplayer();
	$('.search').tsearch();
  $('.playlist').tplaylist();
  
  var name = $('#nickname').html();
  var user = {'id':idUSER, 'name':name}
  socket.emit('set user', user);

  socket.on('ready', function (items, users) {
    $('.users').tusers(users);
    for (var i = 0; i<items.length; i++){
     $('.playlist').tplaylist('add', items[i]);
    }
  });

  socket.on('newUser', function (user) {
    console.log('newUser:'+user);
    $('.users').tusers('add', user);
  });

  socket.on('removeUser', function (user) {
    console.log('removeUser:'+user);
    $('.users').tusers('remove', user);
  });

  socket.on('itemAdded', function (data) {
    $('.playlist').tplaylist('add', data);
  });

  socket.on('playItem', function (idItem) {
    $('#ytapiplayer').tplayer('playVideo', idItem);
  });

  socket.on('removeItem', function (idItem) {
    $('.playlist').tplaylist('remove', idItem);
  });

  socket.on('chat', function (data) {
    //$('.comments').tcomments('chat', data);
  });
})
  

function secondsToTime (seconds){
  var minutes = Math.floor(seconds/60);
  seconds = seconds - minutes*60;

  if(seconds<10){
    seconds = '0'+seconds;
  }
  if(minutes<10){
    minutes = '0'+minutes;
  }
  return minutes+':'+seconds;
}



function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};