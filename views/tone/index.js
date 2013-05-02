var config = require('../../config')
  , Like = require('../../controller/like');

exports.init = function (req, res){
}

exports.like = function (req, res){
	Like.likeTone (req.user._doc._id, req.body.tone_id, function(err, tonelike){
    	if(err) res.send({"error":1, "data": tonelike});
    	res.send({"error":0, "data":tonelike});
	});
}
exports.unlike = function (req, res){
	Like.unlikeTone(req.user._doc._id, req.body.tone_id, function(err){
    	if(err) res.send({"error":1});
    	res.send({"error":0});
	});
}