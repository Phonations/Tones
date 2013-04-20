var mongoose = require('mongoose')
  , utils = require('../utils');

var toneSchema = mongoose.Schema({
  id:String,
  thumb:String,
  title:String,
  category:String,
  duration:String,
});

var Tone = mongoose.model('Tone', toneSchema);
exports.Tone = Tone;