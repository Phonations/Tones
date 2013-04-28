$(document).ready(function(){

	$(".create-btn").bind('click', function() {
		$('#create_modal').modal('show');
		$(window).keypress(function(event) {
  			if ( event.which == 13 ) {
     			event.preventDefault();
     			submit_create();
     		}
		});
	});

	$('#submit_create').bind("click", function(){
		submit_create()
	});

	var submit_create = function(){
		console.log('click '+$(this).attr('id'));
        var isValid = true;

		if($('#title').val() == ''){
			$('.title').addClass('error');
			isValid = false;
		}

		if(isValid){
			var str = $('#create_modal form').serialize(); 
			$.ajax({ 
				type: "POST",
				url: "/station/create",
				data: str, 
				success: function(data){ 
					if(data.error == 0){
						console.log('click '+data.title);
						console.log('click '+data.username);
						$('#title').val('');
						$('#create_modal').modal('hide');
						window.location = '/'+data.username+'/s/'+data.title;
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