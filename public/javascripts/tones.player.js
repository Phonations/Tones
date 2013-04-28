function onytplayerStateChange(newState) {
  console.log('newState:'+newState)
   switch(newState){
    case 0:
      onPlayerEnded();
      break;
   }
}

function onYouTubePlayerReady(playerId) {
  isReady = true;
  onPlayerReady(playerId);
}

function yt_loadVideo(playerId, videoId){
  console.log('yt_loadVideo:'+videoId);
  ytplayer = document.getElementById(playerId);
  ytplayer.loadVideoById({'videoId': videoId});
}

function yt_playVideo(playerId) {
  ytplayer = document.getElementById(playerId);
  ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
  ytplayer.mute();
  ytplayer.playVideo();
}

var onPlayerReady = null;
var onPlayerEnded = null;

isPlaying = false;
isReady = false;

var currentVideoId;

(function( $ ){

  function playerReady(playerId){
    $('#ytapiplayer').tplayer('playerReady');
  }
  function playerEnded(){
    $('#ytapiplayer').tplayer('playerEnded');
  }
  
  onPlayerReady = playerReady;
  onPlayerEnded = playerEnded;


  var defaultSettings =  {
      'url' : 'http://www.youtube.com/v/',
      'controls' : '1',
      'showinfo' : '0', 
      'enablejsapi' : '1',
      'playerapiid' : 'ytapiplayer',
      'version' : '3',
      'width' : '620',
      'height' : '360'
    };
  var methods = {
    init : function( options ) {
      var self = this;
      // THIS 
      $(self).data('options.tplayer', $.extend(this, defaultSettings, options));
      options = $(this).data('options.tplayer');

      /*$('.playlist').bind('onItemAdded', function(){
        console.log('onItemAdded:'+isPlaying);
        if(!isPlaying){
          $(self).tplayer('playVideo', $('.playlist li:lt(1)').attr('id'));
        }
      });*/
    },
    playerReady : function(){
      // this.mute();
      yt_playVideo($(this).attr('id'));
      isPlaying = true;
    },

    playerEnded : function(){
      var self = this;
        //options.isPlaying = false;
        //$(self).data('options.tplayer', options);
        //console.log('playerEnded isPlaying:'+isPlaying);


      //$('.playlist').tplaylist('remove', $('.playlist .current').attr('id'));

      isPlaying = false;

      playerStopped($('.player-wrap .tone').attr('id'));
/*
      var nbVideos = $('.playlist li').length;

      console.log('playerEnded:'+nbVideos);

      if(nbVideos>0){
        console.log('nbVideos>0:');
        $(self).tplayer('playVideo', $('.playlist li:lt(1)').attr('id'));
      }else{
        isPlaying = false;
        console.log('nbVideos==0');
      }*/
    },

    playVideo : function(idVideo){
      
      var options = $(this).data('options.tplayer');

      currentVideoId = idVideo;

      isPlaying = true;

      $('.playlist #'+idVideo).addClass('current');

      if(isReady){
        console.log('isReady:'+isReady);
        yt_loadVideo($(this).attr('id'), idVideo);
      }else{
        var params = { allowScriptAccess: "always"};
        var atts = { id: options.playerapiid, class:"img-rounded"};
        swfobject.embedSWF(options.url+idVideo+"?controls="+options.controls+"&showinfo="+options.showinfo+"&enablejsapi="+options.enablejsapi+"&playerapiid="+options.playerapiid+"&version="+options.version,
                               options.playerapiid, options.width, options.height, "8", null, null, params, atts);
      }
    }

  }

  $.fn.tplayer = function( method ) {
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on tplayer' );
    }    
  };

})( jQuery );