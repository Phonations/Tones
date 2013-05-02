

/*var atts = { id: "ytcontroller1" };
swfobject.embedSWF("http://www.youtube.com/v/wycjnCCgUes?enablejsapi=1&playerapiid=ytcontroller1&version=3",
                       "ytcontroller1", "480", "270", "8", null, null, params, atts);

var atts = { id: "ytcontroller2" };
swfobject.embedSWF("http://www.youtube.com/v/wycjnCCgUes?enablejsapi=1&playerapiid=ytcontroller2&version=3",
                       "ytcontroller2", "480", "270", "8", null, null, params, atts);*/



var socket = io.connect();

$(document).ready(function(){
	$('#ytapiplayer').tplayer();
	$('.list-search').tsearch();
  $('.playlist').tplaylist();
  $('.users').tusers();
  $('.messages').tmessages();
  $('.user-info').tuser();
  $('.tone').each(function(){
    $(this).titem();
  });

  socket.emit('init');

  $('.connected-user a').tooltip();

  if($('.player-wrap .tone').attr('id')!=undefined){
    $('#ytapiplayer').tplayer('playVideo', $('.player-wrap .tone').attr('yt_id'));
  }

  socket.on('newUser', function (user) {
    console.log('newUser:'+user);
    $('.users').tusers('add', user);
  });

  socket.on('removeUser', function (user) {
    console.log('removeUser:'+user);
    $('.users').tusers('remove', user);
  });

  socket.on('newItem', function (data) {
    console.log('newItem:'+data.id);
    console.log('newItem:'+data.title);
    $('.playlist').tplaylist('add', data);
  });

  socket.on('playItem', function (idItem) {
    console.log('playItem:'+idItem);
    $('#ytapiplayer').tplayer('playVideo', idItem);
  });

  socket.on('removeItem', function (data) {
    if(data.user_id == $('.user-info').attr('id')){
      $('.user-info').tuser('addStar');
    }
    $('.playlist').tplaylist('remove', data._id);
  });

  socket.on('newMessage', function (data) {
    $('.messages').tmessages('add', data);
  });
})

// we centrilize the call to the socket here
function addItem(data){
  console.log ('addItem')
  socket.emit('addItem',data);
  $('.list-search').tsearch('hide');
  $('.user-info').tuser('removeStar');
}
function playerStopped(idItem){
  console.log ('playerStopped')
  socket.emit('playerStopped',idItem);
}
function sendMessage(data){
  console.log ('sendMessage');
  socket.emit('sendMessage',data);
}

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