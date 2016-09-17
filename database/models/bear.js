var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BearSchema = new Schema({
    name: String,
    noise: String,
    size: Number,
    color: String
});

module.exports = mongoose.model('Bear', BearSchema);