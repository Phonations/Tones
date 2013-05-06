(function( $ ){
  var methods = {
    init : function( options ) {
      
      var self = this;
      nbStar = $('.user-info .icon-star').length;
      if(nbStar==0){
        $('.btn', this).addClass('disabled');
      }else{
      $('.btn', this).bind('click', function(){

        var data = {
          'id':$(self).attr('id'),
          'thumb':$('img', self).attr('src'),
          'title':$('strong', self).html(),
          'category':$('.label', self).html(),
          'duration':$('.muted', self).html()
        }
        console.log('[tsearchitem] init click:'+data.id);
        addItem(data);
      });
        
      }
    }
  }

  $.fn.tsearchitem = function( method ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on tsearchitem' );
    }    
  
  };

})( jQuery );

(function( $ ){
  var methods = {
    init : function( options ) {
      
      console.log('titem init');
      var self = this;
      $('.btn-like', this).bind('click', function(){
        if($('i', this).hasClass('icon-heart-empty')){
            $.ajax({
              dataType: "json",
              data:"tone_id="+$(self).attr('yt_id'),
              type: "POST",
              url: "/tone/like",
              success: function(data){
                if(data.error == 0){
                  $('.btn-like i', self).removeClass('icon-heart-empty').addClass('icon-heart');
                }
              }
            });
          }else{
            $.ajax({
              dataType: "json",
              data:"tone_id="+$(self).attr('yt_id'),
              type: "POST",
              url: "/tone/unlike",
              success: function(data){
                if(data.error == 0){
                  $('.btn-like i', self).removeClass('icon-heart').addClass('icon-heart-empty');
                }
              }
            });
          }
        });
    }
  }

  $.fn.titem = function( method ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on tsearchitem' );
    }    
  
  };

})( jQuery );
