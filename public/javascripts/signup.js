$(document).ready(function(){
	var email_verify = false;
	$('input').bind('focus', function(){
		$(this).parent().parent().removeClass('error');
	})

	function validLetter(password){
		if ( password.match(/[A-z]/) ) {
			return true;
		} else {
			return false;
		}
	}

	function validCapital(password){
		if ( password.match(/[A-Z]/) ) {
			return true;
		} else {
			return false;
		}
	}

	function validNumber(password){
		if ( password.match(/[0-9]/) ) {
			return true;
		} else {
			return false;
		}
	}

	function validFullname(){
		if($("input.fullname").val()!=''){
			$(".fullname-group .help-inline span").css('display', 'none');
			$(".fullname-group .success").css('display', 'block');
		}else{
			$(".fullname-group .help-inline span").css('display', 'none');
			$(".fullname-group .error").css('display', 'block');
		}
	}
	
	$("input.fullname").keyup(function() {
		window.setTimeout(function(){
			validFullname();
		}, 40);
	});

	$("input.fullname").focusin(function() {
		if($("input.fullname").val()==''){
			$(".fullname-group .help-inline span").css('display', 'block');
			$(".fullname-group .error").css('display', 'none');
			$(".fullname-group .success").css('display', 'none');
		}
	});


	function validEmail(){
		email_verify = false;
		if($("input.email").val()!=''){
			if(IsEmail($("input.email").val())){
				$(".email-group .help-inline span").css('display', 'none');
				$(".email-group .success").css('display', 'block');
			}else{
				$(".email-group .help-inline span").css('display', 'none');
				$(".email-group .error").css('display', 'block');
			}
		}else{
			$(".email-group .help-inline span").css('display', 'none');
			$(".email-group .required").css('display', 'block');
		}
	}

	$("input.email").keyup(function() {
		window.setTimeout(function(){
			validEmail();
		}, 40);
	});

	$("input.email").focusin(function() {
		if($("input.fullname").val()==''){
			$(".email-group .help-inline span").css('display', 'block');
			$(".email-group .required").css('display', 'none');
			$(".email-group .error").css('display', 'none');
			$(".email-group .success").css('display', 'none');
			$(".email-group .exist").css('display', 'none');
		}
	});

	function validPassword(){
		var password = $("input.password").val();
		if(password.length<6){
			$(".password-group .help-inline span").css('display', 'none');
			$(".password-group .required").css('display', 'block');
		}else{
			switch (true){
				case validNumber(password)&&validLetter(password)&&validCapital(password):
					$(".password-group .help-inline span").css('display', 'none');
					$(".password-group .success.good").css('display', 'block');
					break;
				case !validNumber(password)&&validLetter(password)&&validCapital(password):
				case validNumber(password)&&!validLetter(password)&&validCapital(password):
				case validNumber(password)&&validLetter(password)&&!validCapital(password):
					$(".password-group .help-inline span").css('display', 'none');
					$(".password-group .success.okay").css('display', 'block');
					break;
				case !validNumber(password)&&validLetter(password)&&!validCapital(password):
				case !validNumber(password)&&!validLetter(password)&&validCapital(password):
					$(".password-group .help-inline span").css('display', 'none');
					$(".password-group .success.more").css('display', 'block');
					break;
				case validNumber(password)&&!validLetter(password)&&!validCapital(password):
					$(".password-group .help-inline span").css('display', 'none');
					$(".password-group .error").css('display', 'block');
					break;
			}
		}
	}

	$("input.password").keyup(function() {
		window.setTimeout(function(){
			validPassword()
		}, 40);
	});
	
	$("input.password").focusin(function() {
		var password = $("input.password").val();
		console.log('password.length:'+password.length);
		if(password.length==0){
			$(".password-group .help-inline span").css('display', 'block');
			$(".password-group .required").css('display', 'none');
			$(".password-group .error").css('display', 'none');
			$(".password-group .success").css('display', 'none');
		}
	});

	$("input.username").keyup(function() {
		window.setTimeout(function(){
			if($("input.username").val()!=''){
				if(IsAlphanumeric($("input.username").val())){
				//if(HasNoSpecChar($("input.username").val())){
					$.ajax({ 
						type: "POST",
						url: "/check-username",
						data: 'username='+$("input.username").val(), 
		  				dataType: "json",
						success: function(data){ 
							if(data.error == 0){
								$(".username-group .help-inline span").css('display', 'none');
								$(".username-group .success").css('display', 'block');
							}else{
								$(".username-group .help-inline span").css('display', 'none');
								$(".username-group .exist").css('display', 'block');
							}
						}
					});
				}else{
					$(".username-group .help-inline span").css('display', 'none');
					$(".username-group .error").css('display', 'block');
				}
			}else{
				$(".username-group .help-inline span").css('display', 'none');
				$(".username-group .required").css('display', 'block');
			}
		});
	});
	$("input.username").focusin(function() {
		if($("input.username").val()==''){
			$(".username-group .help-inline span").css('display', 'block');
			$(".username-group .required").css('display', 'none');
			$(".username-group .error").css('display', 'none');
			$(".username-group .success").css('display', 'none');
			$(".username-group .exist").css('display', 'none');
		}
	});
	function init_signup(){
		$("input.username").focus();

		if($("input.password").val()!=''){
			validPassword();
		}else{
			$("input.password").focus();
		}
		if($("input.email").val()!=''){
			validEmail();
		}else{
			$("input.email").focus();
		}
		if($("input.fullname").val()!=''){
			validFullname();
		}else{
			$("input.fullname").focus();
		}
	}

	init_signup();

	$('form').submit(function() {
		if(($(".fullname-group .success").css('display') == 'block')
			&&($(".email-group .success").css('display') == 'block')
			&&(
				($(".password-group .success.okay").css('display') == 'block')
				||($(".password-group .success.good").css('display') == 'block')
				||($(".password-group .success.more").css('display') == 'block')
				)
			&&($(".username-group .success").css('display') == 'block')){

			if(!email_verify){
				$.ajax({ 
					type: "POST",
					url: "/check-email",
					data: 'email='+$("input.email").val(), 
					dataType: "json",
					success: function(data){ 
						if(data.error == 0){
							console.log('submit');
							email_verify = true;
							$('form').submit();
						}else{
							$(".email-group .help-inline span").css('display', 'none');
							$(".email-group .exist").css('display', 'block');
							$("input.email").focus();
							//init_signup();
						}
					}
				});
				//init_signup();
				return false;
			}
		}else{
			//init_signup();
			return false;
		}
	});
});