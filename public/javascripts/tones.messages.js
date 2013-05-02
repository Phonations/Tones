
(function( $ ){

  var methods = {
    init : function( users ) {
      var self = this;
      console.log('tmessages init:');
      $('textarea', this).keypress(function(event){
        if ( event.which == 13 ) {
          event.preventDefault();
          console.log('textarea:'+$(this).val());
          sendMessage({'message':$(this).val()});
          $(this).val('');
        }
      })

    },

    add : function (data){
      var item = ich.message(data);
      $('.module-inner', this).prepend(item);
    }
  };
  $.fn.tmessages = function( method ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on tusers' );
    }    
  
  };
})( jQuery );