


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

      $(this).css('display', 'none');
      
      $("input#search").keyup(function() {
        window.setTimeout(function(){
          console.log($("input").val());
          if($("input").val() == ""){
            $('.self').html('');
          }else{
            $(self).tsearch('search');
          }
        }, 40);
      });

      $('form.navbar-search').submit(function() {
        //$(self).tsearch('search');
        return false;
      });

      $('input#search').on('focus', function(){
          if($("input#search").val() != ""){
            $(self).tsearch('search');
          }
      });
    },

    search : function(){
      var self = this;
      var options = $(this).data('options.tsearch');
      var search_input = $("input#search").val();
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
        var item='<div id="' + val.id + '" class="tone module-inner">'
        +'<img src="'+val.thumbnail.sqDefault+'">'
        +'<div class="tone-text">'
          +'<p><strong>'+val.title+'</strong></p>'
          +'<p class="muted">'+secondsToTime(val.duration)+'</p>'
          +'<span class="label label-important">'+val.category+'</span>'
          +'<button type="button" class="btn btn-success">+ Add to the playlist</button>'
        +'</div>'
        +'<div class="clear">'
        +'</div>'
        +'</div>';
        items.push(item);

      });
      var list = $('<div/>', {
        'class': 'module',
        html: items.join('')
      });
      $(self).css('display', 'block');
      if($('.modal-backdrop').length == 0){
        var backdrop = $('<div/>', {'class': 'modal-backdrop'});
        $('body').append(backdrop)
        backdrop.addClass('fade');
        backdrop.addClass('out');
        window.setTimeout(function(){
          backdrop.removeClass('out');
          backdrop.addClass('in');
        },50);
        backdrop.bind('click',function(){
          $(self).tsearch('hide');
        })
      }
      $(self).html(list);
      list.addClass('img-rounded');
      $('.tone', self).each(function(){
        $(this).titem();
      });

    },

    hide : function(){
      var self = this;
      var backdrop = $('.modal-backdrop');
      backdrop.removeClass('in');
      backdrop.addClass('out');
      $(self).css('display', 'none');
      window.setTimeout(function(){
        backdrop.remove();
      },200);
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