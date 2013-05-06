$(document).ready(function(){
	$('.profile-sidenav li').bind('click', function(){
		if(!$(this).hasClass('active')){
			$('.profile-sidenav .active').removeClass('active');
			$(this).addClass('active');
			$('.span9 .module').css('display', 'none');
			$('.span9 .module.'+$(this).attr('id')).css('display', 'block');
		}
	})
});