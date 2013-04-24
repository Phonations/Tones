var mongoose = require('mongoose')
  , utils = require('../utils');

var toneSchema = mongoose.Schema({
  id:String,
  thumb:String,
  title:String,
  category:String,
  duration:String
});

var Tone = mongoose.model('Tone', toneSchema);
exports.Tone = Tone;

var itemToneSchema = mongoose.Schema({
  tone_id:String,
  user_id:String
});

var ItemTone = mongoose.model('ItemTone', itemToneSchema);
exports.ItemTone = ItemTone;