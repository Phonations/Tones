/*$(document).ready(function(){
	$('input').bind('focus', function(){
		$(this).parent().parent().removeClass('error');
	})
	$('.front-signin form').submit(function() {
        var email = $('.email', this).val();
        var password = $('.password', this).val();
        var isValid = true;

		if(email== ''){
			$('.email', this).parent().parent().addClass('error');
			isValid = false;
        }
        if(IsEmail(email)==false){
			$('.email', this).parent().parent().addClass('error');
			isValid = false;
        }
		if(password.length < 6){
			$('.password', this).parent().parent().addClass('error');
			isValid = false;
        }
		if(isValid){
			var str = $(this).serialize(); 
			$.ajax({ 
				type: "POST",
				url: "/login",
				data: str, 
				success: function(msg){ 
					console.log(msg);
					if(msg == true){
						document.location.reload();
					}else{
						var alert = '<div class="alert alert-error"><button class="close">×</button><span>'+msg+'</span></div>';
						$('.message').html(alert);
						$('.close').attr('type', 'button');
						$('.close').attr('data-dismiss', 'alert');
					}
				}
			});
		}
        return false;
	});
});*/