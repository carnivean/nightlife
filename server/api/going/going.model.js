/**
 * Created by Erik Kynast on 27.09.2015.
 */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var GoingSchema = new Schema({
  bars: [String],
  userName: String
});

module.exports = mongoose.model('Going', GoingSchema);
