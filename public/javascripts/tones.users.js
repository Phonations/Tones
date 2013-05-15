
(function( $ ){

  var methods = {
    init : function( users ) {
      var self = this;
      console.log('tusers init:');

    },

    add : function (user){
      var item = '<div class="connected-user" id="' + user._id + '">'
                +'<a href="/'+user.url+'">'
                +'<img src="/images/avatar.jpg" width="40px" class="img-rounded avatar" data-toggle="tooltip" title="'+user.username+'"/>'
                +'</a></div>';

      if($('.module-inner #'+user._id, this).length==0){
        $('.module-inner', this).prepend(item);
        $('.connected-user a img').tooltip();
        $('.module-title span', this).html('('+$('.connected-user', this).length+')');
      }
    },

    remove : function (user){
      $('.module-inner #'+user._id, this).remove();
      $('.module-title span', this).html('('+$('.connected-user', this).length+')');
    }
  };
  $.fn.tusers = function( method ) {
    
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