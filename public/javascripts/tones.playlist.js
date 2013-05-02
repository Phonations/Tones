
(function( $ ){

  var methods = {
    init : function( options ) {
      console.log('tplaylist init:');
      var self = this;

      /*$('.tone', self).each(function(){
        $(this).titem();
      });*/
    },
    add : function (data){
      var self = this;

      /*var item = '<div id="' + data._id + '"  id_yt="' + data.id + '" class="tone module-inner">' 
              +'<img src="' + data.thumb + '">' 
              +'<div class="tone-text">' 
              +'<span class="muted"></span>' 
              +'<p> <strong>' + data.title + '</strong></p>' 
              +'<p class="muted">' + data.duration + '</p>' 
              +'<p><span class="label label-important">' + data.category + '</span></p>' 
              +'<p>Added by <span class="label label-warning">' + data.user.username + '</span></p>' 
              +'</div>' 
              +'<div class="clear"></div></div>';*/
      console.log('data.id :'+data.id );        
      var item = ich.tone(data);



      if($('.player-wrap .tone').attr('id')==undefined){
        $('.player-wrap .tone').remove();
        $('.player-wrap').append(item);
        $('#ytapiplayer').tplayer('playVideo', $('.player-wrap .tone').attr('yt_id'));
      }else{
        $(this).append(item);
      }
      $(item).titem();
    },
    remove : function (videoId){
      if($('.player-wrap .tone').attr('id')==videoId){
        $('.player-wrap .tone').remove();
        $('.player-wrap').append($('.tone:lt(1)', this));
      }else{
        $('#'+videoId, this).remove();
      }
    }
  };
  $.fn.tplaylist = function( method ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on tplaylist' );
    }    
  
  };
})( jQuery );