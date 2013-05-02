function IsEmail(email) {
	var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if(!regex.test(email)) {
	   return false;
	}else{
	   return true;
	}
}

function IsAlphanumeric(value){
	var regex = /^[a-zA-Z0-9\-\_]+$/;
	if(!regex.test(value)) {
	   return false;
	}else{
	   return true;
	}
}

function HasNoSpecChar(value){
	var regex = /[$/:-?{-~!/"#\'^`\[\]]/;
	if(regex.test(value)) {
	   return false;
	}else{
	   return true;
	}
}