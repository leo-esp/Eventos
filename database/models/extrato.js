var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExtratoSchema = new Schema({
    value: Number,
    mes: String
});

module.exports = mongoose.model('Extrato', ExtratoSchema);