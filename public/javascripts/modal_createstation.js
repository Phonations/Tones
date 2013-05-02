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
		submit_create();
	});

	$("#create_modal input.title").keyup(function() {
		var title = $(this).val();
		window.setTimeout(function(){
			if(title!==''){
					$("#create_modal .title-group .help-inline span").css('display', 'none');
					$("#create_modal .title-group .success").css('display', 'block');
			}else{	
				$("#create_modal .title-group .help-inline span").css('display', 'none');
				$("#create_modal .title-group .required").css('display', 'block');
			}
		}, 40);
	});

	$("#create_modal input.title").focusin(function() {
		if($(this).val()===''){
			$("#create_modal .title-group .help-inline span").css('display', 'block');
			$("#create_modal .title-group .required").css('display', 'none');
			$("#create_modal .title-group .error").css('display', 'none');
			$("#create_modal .title-group .success").css('display', 'none');
		}
	});


	$("#create_modal .description").keyup(function() {
		var description = $(this).val();
		console.log(description);
		window.setTimeout(function(){
			if(description!==''){
				$("#create_modal .description-group .help-inline span").css('display', 'none');
				$("#create_modal .description-group .success").css('display', 'block');
			}else{
				$("#create_modal .description-group .help-inline span").css('display', 'block');
				$("#create_modal .description-group .success").css('display', 'none');
			}
		}, 40);
	});
	
	$('#create_modal .nb_users').change(function() {
		$("#create_modal .nb_users-group .help-inline span").css('display', 'none');
		$("#create_modal .nb_users-group .success").css('display', 'block');
	});
	
	
	$('#create_modal .nb_tones').change(function() {
		$("#create_modal .nb_tones-group .help-inline span").css('display', 'none');
		$("#create_modal .nb_tones-group .success").css('display', 'block');
	});

	var submit_create = function(){
        var isValid = true;

		if($('#create_modal input.title').val() === ''){
			$('#create_modal input.title').focus();
			isValid = false;
		}
		console.log('submit_create:'+isValid);
		if(isValid){
			var str = $('#create_modal form').serialize(); 
			$.ajax({ 
				type: "POST",
				url: "/station/create",
				data: str, 
				success: function(data){ 
					console.log('submit_create success:'+data);
					if(data.error === 0){
						$('#title').val('');
						$('#create_modal').modal('hide');
						window.location = '/'+data.user_url+'/s/'+data.station_url;
					}else{
						var alert = '<div class="alert alert-error"><button class="close">×</button><span>'+data.message+'</span></div>';
						$('#create_modal .message').html(alert);
						$('#create_modal .message .close').attr('type', 'button');
						$('#create_modal .message .close').attr('data-dismiss', 'alert');
					}
				}
			});
		}
	};
});