(function( $ ){
  var methods = {
    init : function( options ) {
      
      var self = this;

      $(this).bind('click', function(){
        //$('.playlist').tplaylist('add', $(this).attr('id'));
        var data = {
          id:$(self).attr('id'),
          thumb:$('img', self).attr('src'),
          title:$('.title', self).html(),
          category:$('.cat', self).html(),
          duration:$('.duration', self).html()
        }


      /*var item = '<li id="' + $('#'+videoId).attr('id') + '" class="item">' 
              +'<img width="120px" src="'+$('#'+videoId+' img').attr('src')+'">'
              +'<div class="item_content">'
              +'<h3>'+$('#'+videoId+' h3').html()+'</h3>'
              +'<p class="cat">'+$('#'+videoId+' .cat').html()+'</p>'
              +'<p>duration: <span class="duration">'+$('#'+videoId+' .duration').html()+'</span></p>'
              +'<div></li>';*/
              
        addItem(data);
      })
    }
  }

  $.fn.titem = function( method ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on titem' );
    }    
  
  };

})( jQuery );
