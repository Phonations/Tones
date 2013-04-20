var mongoose = require('mongoose')
  , utils = require('../utils');

var stationSchema = mongoose.Schema({
    name: String,
    id_user_create : String,
    users: Array,
    tones: Array,
    current: Number,
    nb_users: Number,
    nb_tones: Number
});


var Station = mongoose.model('Station', stationSchema);
exports.Station = Station;