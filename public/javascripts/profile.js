$(document).ready(function(){

    $('.connected-user a img').tooltip();
    
	$('.profile-sidenav li').bind('click', function(){
		if(!$(this).hasClass('active')){
			$('.profile-sidenav .active').removeClass('active');
			$(this).addClass('active');
			$('.span9 .module').css('display', 'none');
			$('.span9 .module.'+$(this).attr('id')).css('display', 'block');
		}
	})

	$('.add-friend').bind('click', function(){
		var self = this;
		$.ajax({
			dataType: "json",
			data:"user1_id="+$(this).attr('user1_id')+"&user2_id="+$(this).attr('user2_id'),
			type: "POST",
			url: "/profile/sendfriendship",
			success: function(data){
				if(!data.error){
					if(data.status == "sent"){
						$(self).removeClass('add-friend').addClass('disabled');
						$(self).text("Friend request sent");
					}
					if(data.status == "friends"){
						$(self).removeClass('add-friend').addClass('disabled').addClass('btn-success');
						$(self).text("Friend");
					}
				}
			}
		})
	})
});