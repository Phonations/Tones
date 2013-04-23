
(function( $ ){

  var methods = {
    init : function( users ) {
      var self = this;
      console.log('tuser init:');
    },
    addStar : function() {
      var self = this;
      console.log('tuser addTone');
      var nbStationStar = $('.nb_tones .icon-white', this).length;
      var nbUserStar = $('.nb_tones .icon-star', this).length;
      $('#nb_tones', this).html((nbUserStar+1)+' ');
      if(nbUserStar <nbStationStar){
        $('.nb_tones #star'+(nbUserStar), this).removeClass('icon-star-empty').addClass('icon-star');
      }
    },
    removeStar : function() {
      var self = this;
      console.log('tuser removeStar');
      var nbStationStar = $('.nb_tones .icon-white', this).length;
      var nbUserStar = $('.nb_tones .icon-star', this).length;
      $('#nb_tones', this).html((nbUserStar-1)+' ');
      if(nbUserStar>0){
        $('.nb_tones #star'+(nbUserStar-1), this).removeClass('icon-star').addClass('icon-star-empty');
      }
    },
  };
  $.fn.tuser = function( method ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on tuser' );
    }    
  
  };
})( jQuery );