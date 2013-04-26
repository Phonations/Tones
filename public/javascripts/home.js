$(document).ready(function(){

	$('input').bind('focus', function(){
		$(this).parent().parent().removeClass('error');
	})

					$(".list-stations li").bind('click', function() {
						window.location = '/station/'+$(this).attr('id');
					});
	/*$('input.typeahead').typeahead({                                
		title: 'station',                                                          
		remote: '/stations.json',
		template: '<p><strong>{{title}}</strong></p>',
    	engine: Hogan
	});*/

	$("input#search").keyup(function() {
		window.setTimeout(function(){
		console.log($("input").val());
		if($("input").val() == ""){
			$('.list-stations').html('');
		}else{
		 // do the ajax call here
			$.ajax({ 
				type: "POST",
				url: "/stations",
				data: 'search='+$("input#search").val(), 
  				dataType: "json",
				success: function(data){ 
				  var items = [];
				 
				  $.each(data, function(key, station) {
				    items.push('<li id="' + station._id + '"><a>' + station.title + '<small class="text-right">'+station.users.length+' users connected</small></a></li>');
				    //items.push('<li id="' + station._id+'"><a><h4>'+ station.title+'</h4><p><small>'+station.users.length+'users connected</small></p></a></li>';
				  });
				 	
				  $('.list-stations').html('');
				  $('<ul/>', {
				    'class': 'nav nav-tabs nav-stacked',
				    html: items.join('')
				  }).appendTo('.list-stations');



					$(".list-stations li").bind('click', function() {
						window.location = '/station/'+$(this).attr('id');
					});

				}
			});
		}
		}, 40);
	});

	$('#create_modal').modal({
  		keyboard: true,
  		show:false
	})

	$(".create-btn").bind('click', function() {
		$('#create_modal').modal('show');
		$(window).keypress(function(event) {
  			if ( event.which == 13 ) {
     			event.preventDefault();
     			submit_create();
     		}
		});
	});

	$(".list-stations li").bind('click', function() {
		window.location = '/station/'+$(this).attr('id');
	});


	$('#submit_create').bind("click", function(){
		submit_create()
	});

	var submit_create = function(){
		console.log('click '+$(this).attr('id'));
        var isValid = true;

		if($('#title').val() == ''){
			console.log('click '+$('.title').attr('class'));
			$('.title').addClass('error');
			isValid = false;
		}

		if(isValid){
			var str = $('#create_modal form').serialize(); 
			$.ajax({ 
				type: "POST",
				url: "/create-station",
				data: str, 
				success: function(data){ 
					if(data.error == 0){
						$('#title').val('');
						$('#create_modal').modal('hide');
						window.location = '/station/'+data.message;
					}else{
						var alert = '<div class="alert alert-error"><button class="close">×</button><span>'+data.message+'</span></div>';
						$('#create_modal .message').html(alert);
						$('#create_modal .message .close').attr('type', 'button');
						$('#create_modal .message .close').attr('data-dismiss', 'alert');
					}
				}
			});
		}
	}
});