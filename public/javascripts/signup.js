$(document).ready(function(){
	$('input').bind('focus', function(){
		$(this).parent().parent().removeClass('error');
	})

	$('form').submit(function() {
        var username = $('#username').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var confirm = $('#confirm').val();

        var isValid = true;

		if($('#username').val() == ''){
			$('.username').addClass('error');
			isValid = false;
		}
		if(email== ''){
			$('.email').addClass('error');
			isValid = false;
        }
        if(IsEmail(email)==false){
			$('.email').addClass('error');
			isValid = false;
        }
		if(password.length < 6){
			$('.password').addClass('error');
			isValid = false;
        }
		if(confirm.length < 6){
			$('.confirm').addClass('error');
			isValid = false;
        }
		if(password != confirm){
			$('.password').addClass('error');
			$('.confirm').addClass('error');
			isValid = false;
        }
        
		if(!isValid)
			return false;
	});
});