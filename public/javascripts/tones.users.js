
(function( $ ){

  var methods = {
    init : function( users ) {
      var self = this;
      console.log('tusers init:');

    },

    add : function (user){
      listusers.push(user);
      $(this).tusers('update');
      var item = '<div class="connected-user" id="' + user.id + '">'
                +'<a href="#" data-toggle="tooltip" title="'+.user.username+'">'
                +'<img src="/images/avatar.jpg" width="40px" class="img-rounded avatar"/>'
                +'</a></div>';
    },

    update : function (){
      var self = this;

      $('#menu-users .badge').html(listusers.length);
      var items = [];
      $.each(listusers, function(key, val) {
        var name = val.name;
        if(idUSER == val.id){
          name += " (you)"
        }
        /*var item = '<li id="' + val.id + '" class="item img-rounded">' 
                +'<img src="/images/avatar.jpg" width="40px" height="40px" class="img-rounded">'
                +'<div class="item_content">'
                +'<h3 class="name">'+name+'</h6>'
                +'<div></li>';*/

   var item = '<div class="connected-user" id="' + val.id + '">'
              +'<a href="#" data-toggle="tooltip" title="'+name+'">'
              +'<img src="/images/avatar.jpg" width="40px" class="img-rounded avatar"/>'
              +'</a></div>';
        items.push(item);

      });
      var list = $('<ul/>', {
        'class': 'my-new-list',
        html: items.join('')
      });

      $(self).html(list);
    },

    remove : function (user){
      var i = 0;
      while(listusers[i].id!=user.id){
        i++;
      }
      listusers.splice(i, 1);
      $(this).tusers('update');
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