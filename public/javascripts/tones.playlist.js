
(function( $ ){

  var methods = {
    init : function( options ) {
      console.log('tplaylist init:');
    },
    add : function (data){
      var self = this;
      /*var item = '<li id="' + data.id + '" class="item img-rounded">' 
              +'<img width="120px" src="'+data.thumb+'" class="img-rounded">'
              +'<div class="item_content">'
              +'<h6 class="title">'+data.title+'</h6>'
              +'<div class="span1">'
              +'<p class="cat label label-important">'+data.category+'</p>'
              +'<p><span class="duration">'+data.duration+'</span></p>'
              +'</div>'
              +'<div class="addedby">'
              +'<p>added by <span class="label label-success">'+data.user.name+'</span></p>'
              +'</div></div></li>';*/
      var item = '<div id="' + data._id + '" class="tone module-inner">' 
              +'<img src="' + data.thumb + '">' 
              +'<div class="tone-text">' 
              +'<span class="muted"></span>' 
              +'<p> <strong>' + data.title + '</strong></p>' 
              +'<p class="muted">' + data.duration + '</p>' 
              +'<span class="label label-important">' + data.category + '</span>' 
              +'</div>' 
              +'<div class="clear"></div></div>';

      if($('.player-wrap .tone').attr('id')==undefined){
        $('.player-wrap .tone').remove();
        $('.player-wrap').append(item);
      }else{
        $(this).append(item);
      }
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