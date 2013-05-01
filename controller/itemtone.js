var ItemTone = require('../providers/tone').ItemTone

exports.findById = function(itemtone_id, fn){
}

exports.findListByIds = function(itemtone_ids, fn){
}

exports.findListByStation = function(station_id, fn){
}

exports.findListByUser = function(user_id, fn){
}

exports.findListByTone = function(tone_id, fn){
}

exports.createItemTone = function(data, fn){
	var itemTone = new ItemTone({
		'tone_id':data.tone_id,
		'user_id':data.user_id,
		'station_id':data.station_id
	});
	itemTone.save(function(err, itemTone){
		if(err){
			fn(err, {"error":"[station] getStationById: An error has occurred"});
		}else{
			fn(err, itemTone);
		}
  });
}