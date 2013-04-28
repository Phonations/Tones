var config = require('../../config')
  , User = require('../../providers/user').User
  , utils = require('../../utils')
  , Station = require('../../providers/station').Station;

exports.init = function (req, res){
}

exports.like = function (req, res){
	utils.likeTone (req.body.user_id, req.body.tone_id, function(err, tonelike){
    	if(err) res.send({"error":1, "data": tonelike});
    	res.send({"error":0, "data":tonelike});
	});
}
exports.unlike = function (req, res){
	utils.unlikeTone(req.body.user_id, req.body.tone_id, function(err){
    	if(err) res.send({"error":1});
    	res.send({"error":0});
	});
}