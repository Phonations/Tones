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
          id:$(self).attr('id'),
          thumb:$('img', self).attr('src'),
          title:$('strong', self).html(),
          category:$('.label', self).html(),
          duration:$('.muted', self).html()
        }

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
      $(this).bind('click', function(){
        //$('.playlist').tplaylist('add', $(this).attr('id'));
        var data = {
          id:$(self).attr('id'),
          thumb:$('img', self).attr('src'),
          title:$('strong', self).html(),
          category:$('.label', self).html(),
          duration:$('.muted', self).html()
        }

        console.log('like');

        var tone_id = $(this).attr("id");

        if($('.unlike', self).length>0){
          $.ajax({
            dataType: "json",
            data:"tone_id="+tone_id,
            type: "POST",
            url: "/tone/like",
            success: function(data){
              //$(self).tsearch('result', data);
              if(data.error == 0){
                $('.unlike', self).removeClass('unlike').addClass('like');
              }
            }
          });
        }

        if($('.like', self).length>0){
          $.ajax({
            dataType: "json",
            data:"tone_id="+tone_id,
            type: "POST",
            url: "/tone/unlike",
            success: function(data){
              //$(self).tsearch('result', data);
              if(data.error == 0){
                $('.like', self).removeClass('like').addClass('unlike');
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
