const mongoose = require('mongoose');

// Define a new schema for the homicides data
const homicideSchema = new mongoose.Schema({
  OBJECTID: Number,
  EVENT_UNIQUE_ID: String,
  OCC_DATE: String,
  OCC_YEAR: Number,
  OCC_MONTH: String,
  OCC_DOW: String,
  OCC_DOY: Number,
  OCC_DAY: Number,
  OCC_HOUR: Number,
  DIVISION: String,
  DEATH: String,
  INJURIES: String,
  LAT_WGS84: Number,
  LONG_WGS84: Number,
  x: Number,
  y: Number,
});

const Homicide = mongoose.model('Homicide', homicideSchema, 'homicides');  

module.exports = Homicide;
