


(function( $ ){
	var defaultSettings =  {
      'url' : 'https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&q='
    };
  var methods = {
    init : function( options ) {
    	
      var self = this;
    	// THIS 
    	$(this).data('options.tsearch', $.extend(this, defaultSettings, options));
    	
    	var options = $(this).data('options');
      /*$('#search', this).bind('click', function(){
        $(self).tsearch('search');
      });*/
      $('form.navbar-search').submit(function() {
        $(self).tsearch('search');
        return false;
      });

      $('#search_input').on('focus', function(){
          $('.search.list').css('display', 'block');
          $('.comments.list').css('display', 'none');
          $('.users.list').css('display', 'none');
      });
    },

    search : function(){
      var self = this;
      var options = $(this).data('options.tsearch');
      var search_input = $('#search_input').val();
      $.ajax({
        dataType: "json",
        url: options.url+search_input,
        success: function(data){
          $(self).tsearch('result', data);
        }
      });
    },

    result : function(data){
      var self = this;
      var items = [];
      $.each(data.data.items, function(key, val) {
        var item = '<li id="' + val.id + '" class="item img-rounded">' 
                +'<img width="120px" src="'+val.thumbnail.sqDefault+'" class="img-rounded">'
                +'<div class="item_content">'
                +'<h6 class="title">'+val.title+'</h6>'
                +'<p class="cat label label-important">'+val.category+'</p>'
                +'<p><span class="duration">'+secondsToTime(val.duration)+'</span></p>'
                +'<div></li>';
        items.push(item);

      });
      var list = $('<ul/>', {
        'class': 'my-new-list',
        html: items.join('')
      });
      $(self).html(list);

      $('.item', self).each(function(){
        $(this).titem();
      });
    }

  };
  $.fn.tsearch = function( method ) {
    
    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on tsearch' );
    }    
  
  };

})( jQuery );